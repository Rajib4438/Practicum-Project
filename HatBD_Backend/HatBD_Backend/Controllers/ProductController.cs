using Dapper;
using HatBD.Models;
using HatBD_Backend.Context;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly DapperContext _context;
        private object connection;

        public ProductController(IWebHostEnvironment env, DapperContext context)
        {
            _env = env;
            _context = context;
        }

        // =========================
        // 1️⃣ GET ALL PRODUCTS
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetAll(int sellerId = 0)
        {
            using var connection = _context.CreateConnection();

            var param = new DynamicParameters();
            param.Add("@flag", 1);
            param.Add("@SellerId", sellerId);

            var data = await connection.QueryAsync<Product>(
                "SP_Product", param, commandType: CommandType.StoredProcedure
            );

            return Ok(data);
        }


        // =========================
        // 2️⃣ GET PRODUCT BY ID
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                using var connection = _context.CreateConnection();

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
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // =========================
        // 3️⃣ CREATE PRODUCT
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Product model)
        {
            try
            {
                if (model.Image == null || model.Image.Length == 0)
                    return BadRequest("No image uploaded");

                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(model.Image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);
                var saveloc = "uploads/" + fileName;

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                using var connection = _context.CreateConnection();

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
                param.Add("@ImageLocation", saveloc);

                // 👇 SellerId added
                param.Add("@SellerId", model.SellerId);

                var id = await connection.ExecuteScalarAsync<int>(
                    "SP_Product",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // =========================
        // 4️⃣ UPDATE PRODUCT
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Product model)
        {
            try
            {
                string filePath = "";

                if (model.Image != null && model.Image.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(model.Image.FileName)}";
                    var physicalPath = Path.Combine(uploadsFolder, fileName);
                    
                    // Save relative path for DB to match Create method
                    filePath = "uploads/" + fileName;

                   using (var stream = new FileStream(physicalPath, FileMode.Create))
                   {
                       await model.Image.CopyToAsync(stream);
                   }
                }
                else
                {
                    // Fetch existing image
                     using var connectionGet = _context.CreateConnection();
                     var paramGet = new DynamicParameters();
                     paramGet.Add("@flag", 2);
                     paramGet.Add("@id", id);
                     var existingProduct = await connectionGet.QueryFirstOrDefaultAsync<Product>("SP_Product", paramGet, commandType: CommandType.StoredProcedure);

                     if(existingProduct != null)
                     {
                        filePath = existingProduct.ImageLocation;

                        // FIX: If existing path is absolute/bad (contains backslashes), fix it to relative
                        if (!string.IsNullOrEmpty(filePath) && (filePath.Contains("\\") || filePath.Contains("wwwroot")))
                        {
                            var nameOnly = Path.GetFileName(filePath);
                            filePath = "uploads/" + nameOnly;
                        }
                     }
                }

                using var connection = _context.CreateConnection();

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
                param.Add("@ImageLocation", filePath);

                // 👇 SellerId added
                param.Add("@SellerId", model.SellerId);

                var result = await connection.QueryFirstOrDefaultAsync(
                    "SP_Product",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // =========================
        // 5️⃣ DELETE PRODUCT
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
                    "SP_Product",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // =========================
        // APPROVE PRODUCT
        // =========================
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveProduct(int id)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var sql = @"UPDATE Product
                            SET isApprove = 1, status = 'Active'
                            WHERE Id = @id";

                await connection.ExecuteAsync(sql, new { id });

                return Ok("Product approved");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // =========================
        // GET APPROVED PRODUCTS
        // =========================
        [HttpGet("approved")]
        public async Task<IActionResult> GetApprovedProducts()
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 6);

                var data = await connection.QueryAsync<Product>(
                    "SP_Product",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // =========================
        // UPDATE REJECTION REASON
        // =========================
        [HttpPut("updateRejectionReason")]
        public async Task<IActionResult> UpdateRejectionReason([FromBody] RejectionDto dto)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@flag", 7);
                param.Add("@id", dto.id);
                param.Add("@rejectionReason", dto.reason);
                param.Add("@status", "Rejected");

                var rowsAffected = await connection.ExecuteAsync(
                    "SP_Product",
                    param,
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { rowsAffected });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
