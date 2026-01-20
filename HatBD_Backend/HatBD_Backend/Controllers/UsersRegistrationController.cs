using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace HatBD_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRegistrationController : ControllerBase
    {
        private readonly DapperContext _context;

        public UserRegistrationController(DapperContext context)
        {
            _context = context;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistration user)
        {
            using var con = _context.CreateConnection();

            var exists = await con.ExecuteScalarAsync<int>(
                @"SELECT COUNT(*) FROM UserRegistration
                  WHERE Email = @Email
                     OR (@Phone IS NOT NULL AND Phone = @Phone)
                     OR (@UserName IS NOT NULL AND UserName = @UserName)",
                user);

            if (exists > 0)
                return BadRequest("Duplicate Email / Phone / Username");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var sql = @"
                INSERT INTO UserRegistration
                (RegisterAs, FullName, Email, Phone, UserName, Password, Gender, IsApproved, Address)
                VALUES
                (@RegisterAs, @FullName, @Email, @Phone, @UserName, @Password, @Gender,
                 CASE WHEN @RegisterAs = 'Seller' OR @RegisterAs = 'Rider' THEN 0 ELSE 1 END, @Address)";

            await con.ExecuteAsync(sql, user);

            return Ok(new
            {
                msg = "Registration Successful",
                status = 200,
                data = user
            });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            using var con = _context.CreateConnection();

            var user = await con.QuerySingleOrDefaultAsync<UserRegistration>(
                "SELECT * FROM UserRegistration WHERE UserName = @UserName",
                login);

            if (user == null)
                return Unauthorized("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                return Unauthorized("Invalid credentials");

            if (!user.IsApproved)
                return Unauthorized("Account not approved");

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Phone,
                user.RegisterAs,
                user.Address // ✅ Include Address in login response
            });
        }

        // ================= SELLER & RIDER APPROVAL (ADMIN) =================
        [HttpPut("approve-seller/{id}")]
        public async Task<IActionResult> ApproveSeller(int id)
        {
            using var con = _context.CreateConnection();

            var rows = await con.ExecuteAsync(
                @"UPDATE UserRegistration
                  SET IsApproved = 1
                  WHERE Id = @Id AND (RegisterAs = 'Seller' OR RegisterAs = 'Rider')",
                new { Id = id });

            if (rows == 0)
                return NotFound("User not found or already approved");

            return Ok("User Approved");
        }

        // ================= GET ALL USERS =================
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            using var con = _context.CreateConnection();

            var users = await con.QueryAsync<UserRegistration>(
                "SELECT * FROM UserRegistration");

            return Ok(users);
        }

        // ================= GET USER PROFILE =================
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetUserProfile(int id)
        {
            using var con = _context.CreateConnection();

            var user = await con.QuerySingleOrDefaultAsync<UserRegistration>(
                @"SELECT Id, RegisterAs, FullName, Email, Phone, UserName, Gender, Address,
                  NID, TradeLicense, ShopAddress, PermanentAddress,  -- 🔥 NEW
                  CreatedAT
                  FROM UserRegistration
                  WHERE Id = @Id",
                new { Id = id });

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        // ================= UPDATE PROFILE =================
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UserRegistration model)
        {
            using var con = _context.CreateConnection();
            
            var sql = @"
                UPDATE UserRegistration
                SET FullName = @FullName,
                    Phone = @Phone,
                    Address = @Address,
                    Gender = @Gender,
                    NID = @NID,                             -- 🔥 NEW
                    TradeLicense = @TradeLicense,           -- 🔥 NEW
                    ShopAddress = @ShopAddress,             -- 🔥 NEW
                    PermanentAddress = @PermanentAddress    -- 🔥 NEW
                WHERE Id = @Id";

            // Ensure Id matches route
            model.Id = id;

            var rows = await con.ExecuteAsync(sql, model);

            if (rows == 0)
                return NotFound("User not found");

            return Ok(new { msg = "Profile Updated Successfully", status = 200 });
        }


        [HttpGet("riders")]
        public async Task<IActionResult> GetRiders()
        {
            using var con = _context.CreateConnection();

            var riders = await con.QueryAsync(
                @"SELECT 
            Id,
            FullName,
            Phone,
            Email,
            Address
          FROM UserRegistration
          WHERE RegisterAs = 'Rider'
            AND IsApproved = 1");

            return Ok(riders);
        }


    }
}
