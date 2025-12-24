using Dapper;
using HatBD.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace HatBD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection CreateConnection()
        {
            return new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );
        }

        // =========================
        // 1️⃣ GET ALL PRODUCTS
        // flag = 1
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            using var connection = CreateConnection();

            var param = new DynamicParameters();
            param.Add("@flag", 1);

            var data = await connection.QueryAsync<Product>(
                "SP_Product",
                param,
                commandType: CommandType.StoredProcedure
            );

            return Ok(data);
        }

        // =========================
        // 2️⃣ GET PRODUCT BY ID
        // flag = 2
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            using var connection = CreateConnection();

            var param = new DynamicParameters();
            param.Add("@flag", 2);
            param.Add("@id", id);

            var data = await connection.QueryFirstOrDefaultAsync<Product>(
                "SP_Product",
                param,
                commandType: CommandType.StoredProcedure
            );

            return Ok(data);
        }

        // =========================
        // 3️⃣ CREATE PRODUCT
        // flag = 3
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create(Product model)
        {
            using var connection = CreateConnection();

            var param = new DynamicParameters();
            param.Add("@flag", 3);
            param.Add("@name", model.name);
            param.Add("@brand", model.brand);
            param.Add("@description", model.description);
            param.Add("@price", model.price);
            param.Add("@stockquantity", model.stockquantity);
            param.Add("@status", model.status);
            param.Add("@createdby", model.createdby);
            param.Add("@categoryid", model.categoryid);
            param.Add("@subcategoryid", model.subcategoryid);

            var id = await connection.ExecuteScalarAsync<int>(
                "SP_Product",
                param,
                commandType: CommandType.StoredProcedure
            );

            return Ok(new { id });
        }

        // =========================
        // 4️⃣ UPDATE PRODUCT
        // flag = 4
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product model)
        {
            using var connection = CreateConnection();

            var param = new DynamicParameters();
            param.Add("@flag", 4);
            param.Add("@id", id);
            param.Add("@name", model.name);
            param.Add("@brand", model.brand);
            param.Add("@description", model.description);
            param.Add("@price", model.price);
            param.Add("@stockquantity", model.stockquantity);
            param.Add("@status", model.status);
            param.Add("@updatedby", model.updatedby);
            param.Add("@isactive", model.isactive);
            param.Add("@categoryid", model.categoryid);
            param.Add("@subcategoryid", model.subcategoryid);

            var result = await connection.QueryFirstOrDefaultAsync(
                "SP_Product",
                param,
                commandType: CommandType.StoredProcedure
            );

            return Ok(result);
        }

        // =========================
        // 5️⃣ DELETE PRODUCT (SOFT)
        // flag = 5
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var connection = CreateConnection();

            var param = new DynamicParameters();
            param.Add("@flag", 5);
            param.Add("@id", id);

            var result = await connection.QueryFirstOrDefaultAsync(
                "SP_Product",
                param,
                commandType: CommandType.StoredProcedure
            );

            return Ok(result);
        }
    }
}
