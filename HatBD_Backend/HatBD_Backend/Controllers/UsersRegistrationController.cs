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
                (RegisterAs, FullName, Email, Phone, UserName, Password, Gender, IsApproved)
                VALUES
                (@RegisterAs, @FullName, @Email, @Phone, @UserName, @Password, @Gender,
                 CASE WHEN @RegisterAs = 'Seller' THEN 0 ELSE 1 END)";

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

            // 🔥 ONLY FIX IS HERE (Phone added)
            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Phone,        // ✅ added (REQUIRED for checkout auto-fill)
                user.RegisterAs
            });
        }

        // ================= SELLER APPROVAL (ADMIN) =================
        [HttpPut("approve-seller/{id}")]
        public async Task<IActionResult> ApproveSeller(int id)
        {
            using var con = _context.CreateConnection();

            var rows = await con.ExecuteAsync(
                @"UPDATE UserRegistration
                  SET IsApproved = 1
                  WHERE Id = @Id AND RegisterAs = 'Seller'",
                new { Id = id });

            if (rows == 0)
                return NotFound("Seller not found");

            return Ok("Seller Approved");
        }

        // ================= GET ALL USERS (ADMIN) =================
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            using var con = _context.CreateConnection();

            var users = await con.QueryAsync<UserRegistration>(
                "SELECT * FROM UserRegistration");

            return Ok(users);
        }

        // ================= GET USER BY ID =================
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetUserProfile(int id)
        {
            using var con = _context.CreateConnection();

            var user = await con.QuerySingleOrDefaultAsync<UserRegistration>(
                @"SELECT Id, RegisterAs, FullName, Email, Phone, UserName, Gender, CreatedAT
                  FROM UserRegistration
                  WHERE Id = @Id",
                new { Id = id });

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }
    }
}
