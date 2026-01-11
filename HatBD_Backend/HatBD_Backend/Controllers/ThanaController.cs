using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThanaController : ControllerBase
    {
        private readonly DapperContext _context;

        public ThanaController(DapperContext context)
        {
            _context = context;
        }

        // Insert
        [HttpPost("Insert")]
        public IActionResult Insert(Thana model)
        {
            var query = "SP_Thana";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 1);
            parameters.Add("@ThanaName", model.ThanaName);
            parameters.Add("@DistrictId", model.DistrictId);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // Update
        [HttpPut("Update")]
        public IActionResult Update(Thana model)
        {
            var query = "SP_Thana";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 2);
            parameters.Add("@ThanaId", model.ThanaId);
            parameters.Add("@ThanaName", model.ThanaName);
            parameters.Add("@DistrictId", model.DistrictId);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // Delete
        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var query = "SP_Thana";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 3);
            parameters.Add("@ThanaId", id);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // Select All
        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var query = "SP_Thana";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 4);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query<Thana>(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // Select By Id
        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            var query = "SP_Thana";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 5);
            parameters.Add("@ThanaId", id);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.QueryFirstOrDefault<Thana>(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }
    }
}
