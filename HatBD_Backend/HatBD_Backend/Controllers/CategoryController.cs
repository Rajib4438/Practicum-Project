using Dapper;
using HatBD.Models;
using HatBD_Backend.Context;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace ElegantBoutiqueHouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DapperContext _context;

        public CategoryController(DapperContext context)
        {
            _context = context;
        }

        // ===============================
        // 1️⃣ GET ALL CATEGORY (flag = 1)
        // ===============================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                using var connection = _context.CreateConnection();

                var parameters = new DynamicParameters();
                parameters.Add("@flag", 1);

                var categories = await connection.QueryAsync<Category>(
                    "SP_Category",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ===============================
        // 3️⃣ INSERT CATEGORY (flag = 3)
        // ===============================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category model)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var parameters = new DynamicParameters();
                parameters.Add("@flag", 3);
                parameters.Add("@name", model.name);
                parameters.Add("@createdby", model.createdby);
                parameters.Add("@createdat", DateTime.Now);

                var result = await connection.QueryFirstOrDefaultAsync(
                    "SP_Category",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ===============================
        // 4️⃣ UPDATE CATEGORY (flag = 4)
        // ===============================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category model)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var parameters = new DynamicParameters();
                parameters.Add("@flag", 4);
                parameters.Add("@id", id);
                parameters.Add("@name", model.name);
                parameters.Add("@updatedby", model.updatedby);
                parameters.Add("@updatedat", DateTime.Now);
                parameters.Add("@isactive", model.isactive);

                var result = await connection.QueryAsync(
                    "SP_Category",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ===============================
        // 5️⃣ DELETE CATEGORY (flag = 5)
        // ===============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var parameters = new DynamicParameters();
                parameters.Add("@flag", 5);
                parameters.Add("@id", id);

                var result = await connection.QueryFirstOrDefaultAsync(
                    "SP_Category",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
