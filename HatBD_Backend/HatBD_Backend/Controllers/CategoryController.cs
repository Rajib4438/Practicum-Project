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
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 1);

            using var connection = _context.CreateConnection();
            var categories = await connection.QueryAsync<Category>(
                "SP_Category",
                parameters,
                commandType: CommandType.StoredProcedure);

            return Ok(categories);
        }

        // ===============================
        // 3️⃣ INSERT CATEGORY (flag = 3)
        // ===============================
        [HttpPost]
        public async Task<IActionResult> Create(Category model)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 3);
            parameters.Add("@name", model.name);
            parameters.Add("@createdby", model.createdby);
            parameters.Add("@createdat", DateTime.Now);

            using var connection = _context.CreateConnection();
            var result = await connection.QueryFirstOrDefaultAsync(
                "SP_Category",
                parameters,
                commandType: CommandType.StoredProcedure);

            return Ok(result);
        }

        // ===============================
        // 4️⃣ UPDATE CATEGORY (flag = 4)
        // ===============================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Category model)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 4);
            parameters.Add("@id", id);
            parameters.Add("@name", model.name);
            parameters.Add("@updatedby", model.updatedby);
            parameters.Add("@updatedat", DateTime.Now);
            parameters.Add("@isactive", model.isactive);

            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync(
                "SP_Category",
                parameters,
                commandType: CommandType.StoredProcedure);

            return Ok(result);
        }

        // ===============================
        // 5️⃣ DELETE CATEGORY (flag = 5)
        // ===============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@flag", 5);
            parameters.Add("@id", id);

            using var connection = _context.CreateConnection();
            var message = await connection.QueryFirstOrDefaultAsync(
                "SP_Category",
                parameters,
                commandType: CommandType.StoredProcedure);

            return Ok(message);
        }
    }
}
