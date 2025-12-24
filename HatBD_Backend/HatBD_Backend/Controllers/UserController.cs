using Microsoft.AspNetCore.Mvc;
using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.DTOs;
using HatBD_Backend.Services;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly DapperContext _dapper;
        private readonly EmailService _emailService;
        private readonly DapperContext _context;

        public UserController(
            DapperContext dapper,
            EmailService emailService)
        {
            _dapper = dapper;
            _emailService = emailService;
            _context = dapper;
        }

        // 🔹 FORGOT PASSWORD
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            if (string.IsNullOrEmpty(model.Email))
                return BadRequest("Email is required");

            using var con = _dapper.CreateConnection();

            var user = await con.QueryFirstOrDefaultAsync<UserRegistration>(
                "SELECT * FROM UserRegistration WHERE Email=@Email",
                new { model.Email });

            if (user == null)
                return BadRequest("Email not found");

            var token = Guid.NewGuid().ToString();
            var expiry = DateTime.Now.AddMinutes(15);

            await con.ExecuteAsync(
                @"UPDATE UserRegistration
          SET ResetToken=@Token, TokenExpiry=@Expiry
          WHERE Email=@Email",
                new { Token = token, Expiry = expiry, Email = model.Email });

            // 🔴 FIXED URL (match Angular route)
            var resetLink =
                $"http://localhost:4200/reset-pass?token={token}";

            var mail = await _emailService.SendResetPasswordEmail(
                user.Email,
                user.FullName,
                resetLink
            );

            return Ok(new {status = 200, msg = "Reset URL SEND"});
        }


        // 🔹 RESET PASSWORD
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrEmpty(dto.Token))
                return BadRequest("Token missing");

            using var con = _dapper.CreateConnection();

            var user = await con.QueryFirstOrDefaultAsync<UserRegistration>(
                @"SELECT * FROM UserRegistration
          WHERE ResetToken=@Token
          AND TokenExpiry > GETDATE()",
                new { dto.Token });

            if (user == null)
                return BadRequest("Invalid or expired token");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await con.ExecuteAsync(
                @"UPDATE UserRegistration
          SET Password=@Password,
              ResetToken=NULL,
              TokenExpiry=NULL
          WHERE Id=@Id",
                new { Password = hashedPassword, user.Id });

            return Ok(new { status = 200, msg = "Reset Done" });
        }



    }
}
