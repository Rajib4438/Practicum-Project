using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.Model;
using HatBD_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RiderController : ControllerBase
    {
        private readonly DapperContext _context;

        public RiderController(DapperContext context)
        {
            _context = context;
        }

        // GET - Select (Top 1000)
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            using var con = _context.CreateConnection();
            var result = await con.QueryAsync<Rider>(
                "SP_Rider",
                new { flag = 1 },
                commandType: CommandType.StoredProcedure);

            return Ok(result);
        }

        // POST - Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Rider model)
        {
            using var con = _context.CreateConnection();
            var exists = await con.ExecuteScalarAsync<int>(
               @$"SELECT COUNT(*) FROM UserRegistration
                  WHERE Email = '{model.Email}'");

            if (exists > 0)
                return BadRequest("Duplicate Email / Phone / Username");

            var pass = BCrypt.Net.BCrypt.HashPassword(model.Email);

            var sql = @$"
INSERT INTO UserRegistration
(RegisterAs, FullName, Email, Phone, UserName, Password, Gender, IsApproved)
VALUES
('Rider', '{model.Name}', '{model.Email}', '{model.Phone}', '{model.Email}', '{pass}', 'Male', 1);

SELECT SCOPE_IDENTITY();
";

            var newUserId = await con.ExecuteScalarAsync<int>(sql);
            var result = await con.QueryAsync(
                "SP_Rider",
                new
                {
                    flag = 2,
                    UserId = newUserId,
                    DistrictId = model.DistrictId,
                    ThanaId = model.ThanaId,
                    AreaId = model.AreaId
                },
                commandType: CommandType.StoredProcedure);

           


            return Ok(result);
        }

        // PUT - Update
        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] Rider model)
        {
            using var con = _context.CreateConnection();
            var result = await con.QueryAsync(
                "SP_Rider",
                new
                {
                    flag = 3,
                    RiderId = model.RiderId,
                    
                    DistrictId = model.DistrictId,
                    ThanaId = model.ThanaId,
                    AreaId = model.AreaId
                },
                commandType: CommandType.StoredProcedure);

            return Ok(result);
        }

        // DELETE
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var con = _context.CreateConnection();
            var result = await con.QueryAsync(
                "SP_Rider",
                new
                {
                    flag = 4,
                    RiderId = id
                },
                commandType: CommandType.StoredProcedure);

            return Ok(result);
        }
    }
}
