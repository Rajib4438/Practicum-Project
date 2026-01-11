using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DistrictController : ControllerBase
    {
        private readonly DapperContext _context;

        public DistrictController(DapperContext context)
        {
            _context = context;
        }

        // GET: api/District/Get
        [HttpGet("Get")]
        public IActionResult Get()
        {
            var query = "sp_GetDistrict_Top1000";
            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query<District>(
                    query,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
        }

        // POST: api/District/Add
        [HttpPost("Add")]
        public IActionResult Add([FromBody] District district)
        {
            var query = "INSERT INTO [HatBD].[dbo].[District] (DistrictName) VALUES (@DistrictName); SELECT CAST(SCOPE_IDENTITY() as int);";
            using (var connection = _context.CreateConnection())
            {
                var id = connection.QuerySingle<int>(query, new { district.DistrictName });
                district.DistrictId = id;
                return Ok(district);
            }
        }

        // PUT: api/District/Update/{id}
        [HttpPut("Update/{id}")]
        public IActionResult Update(int id, [FromBody] District district)
        {
            var query = "UPDATE [HatBD].[dbo].[District] SET DistrictName = @DistrictName WHERE DistrictId = @DistrictId";
            using (var connection = _context.CreateConnection())
            {
                var rowsAffected = connection.Execute(query, new { district.DistrictName, DistrictId = id });
                if (rowsAffected > 0)
                    return Ok(district);
                else
                    return NotFound($"District with Id = {id} not found");
            }
        }

        // DELETE: api/District/Delete/{id}
        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var query = "DELETE FROM [HatBD].[dbo].[District] WHERE DistrictId = @DistrictId";
            using (var connection = _context.CreateConnection())
            {
                var rowsAffected = connection.Execute(query, new { DistrictId = id });
                if (rowsAffected > 0)
                    return Ok($"District with Id = {id} deleted successfully");
                else
                    return NotFound($"District with Id = {id} not found");
            }
        }
    }
}
