using Dapper;
using HatBD.Models;
using HatBD_Backend.Context;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        private readonly DapperContext _context;

        public SubCategoryController(DapperContext context)
        {
            _context = context;
        }

        // =========================
        // 1️⃣ GET ALL SUBCATEGORY
        // flag = 1
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 1);

                var data = await connection.QueryAsync<SubCategory>(
                    "SP_subcategory",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =========================
        // 2️⃣ GET BY CATEGORY ID
        // flag = 2
        // =========================
        [HttpGet("by-category/{categoryid}")]
        public async Task<IActionResult> GetByCategory(int categoryid)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 2);
                param.Add("@categoryid", categoryid);

                var data = await connection.QueryAsync<SubCategory>(
                    "SP_subcategory",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =========================
        // 3️⃣ CREATE SUBCATEGORY
        // flag = 3
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SubCategory model)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 3);
                param.Add("@name", model.name);
                param.Add("@createdby", model.createdby);
                param.Add("@categoryid", model.categoryid);

                var id = await connection.ExecuteScalarAsync<int>(
                    "SP_subcategory",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =========================
        // 4️⃣ UPDATE SUBCATEGORY
        // flag = 4
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SubCategory model)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 4);
                param.Add("@id", id);
                param.Add("@name", model.name);
                param.Add("@updatedby", model.updatedby);
                param.Add("@isactive", model.isactive);
                param.Add("@isdelete", model.isdelete);
                param.Add("@categoryid", model.categoryid);

                var result = await connection.QueryFirstOrDefaultAsync(
                    "SP_subcategory",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =========================
        // 5️⃣ DELETE SUBCATEGORY
        // flag = 5
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 5);
                param.Add("@id", id);

                var result = await connection.QueryFirstOrDefaultAsync(
                    "SP_subcategory",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =========================
        // 6️⃣ GET BY ID
        // flag = 6
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 6);
                param.Add("@id", id);

                var data = await connection.QueryFirstOrDefaultAsync<SubCategory>(
                    "SP_subcategory",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
