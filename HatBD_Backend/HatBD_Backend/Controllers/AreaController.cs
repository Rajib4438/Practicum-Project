using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AreaController : ControllerBase
    {
        private readonly DapperContext _context;

        public AreaController(DapperContext context)
        {
            _context = context;
        }

        // Insert
        [HttpPost("Insert")]
        public IActionResult Insert(Area model)
        {
            var query = "SP_Area";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 1);
            parameters.Add("@AreaName", model.AreaName);
            parameters.Add("@ThanaId", model.ThanaId);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        // Update
        [HttpPut("Update")]
        public IActionResult Update(Area model)
        {
            var query = "SP_Area";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 2);
            parameters.Add("@AreaId", model.AreaId);
            parameters.Add("@AreaName", model.AreaName);
            parameters.Add("@ThanaId", model.ThanaId);

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
            var query = "SP_Area";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 3);
            parameters.Add("@AreaId", id);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var query = "SP_Area";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 4);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query<Area>(
                    query,
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                return Ok(result);
            }
        }


        // Select By Id
        [HttpGet("GetById/{id}")]
        public IActionResult GetById(int id)
        {
            var query = "SP_Area";
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 5);
            parameters.Add("@AreaId", id);

            using (var connection = _context.CreateConnection())
            {
                var result = connection.QueryFirstOrDefault<Area>(query, parameters, commandType: CommandType.StoredProcedure);
                return Ok(result);
            }
        }
    }
}
