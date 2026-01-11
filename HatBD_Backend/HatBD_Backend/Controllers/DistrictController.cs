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

        [HttpGet("Get")]
        public IActionResult Get()
        {
            var query = "sp_District";
            using (var connection = _context.CreateConnection())
            {
                var result = connection.Query<District>(
                    query,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
        }
    }
}
