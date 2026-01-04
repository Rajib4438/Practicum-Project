using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DapperContext _context;

        public OrderController(DapperContext context)
        {
            _context = context;
        }

        /* ========== GET ALL ORDERS ========== */
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            using var con = _context.CreateConnection();

            var orders = await con.QueryAsync(
                "SP_order",
                new { flag = 0 },
                commandType: CommandType.StoredProcedure
            );

            return Ok(orders);
        }

        /* ========== ADMIN ORDER LIST ========== */
        [HttpGet("admin")]
        public async Task<IActionResult> GetOrdersForAdmin()
        {
            using var con = _context.CreateConnection();

            var orders = await con.QueryAsync(
                "SP_order",
                new { flag = 5 },
                commandType: CommandType.StoredProcedure
            );

            return Ok(orders);
        }

        /* ========== GET ORDER BY ID ========== */
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            using var con = _context.CreateConnection();

            var order = await con.QueryFirstOrDefaultAsync(
                "SP_order",
                new { flag = 1, id },
                commandType: CommandType.StoredProcedure
            );

            if (order == null)
                return NotFound("Order not found");

            return Ok(order);
        }

        /* ========== CREATE ORDER ========== */
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            using var con = _context.CreateConnection();

            var result = await con.QueryFirstAsync(
                "SP_order",
                new
                {
                    flag = 2,
                    userid = dto.UserId,
                    name = dto.Name,
                    phonenumber = dto.PhoneNumber,
                    address = dto.Address,
                    paymentmethod = dto.PaymentMethod,
                    totalprice = dto.TotalPrice,
                    totaldiscount = dto.TotalDiscount
                },
                commandType: CommandType.StoredProcedure
            );

            return Ok(result);
        }

        /* ========== UPDATE ORDER STATUS (ADMIN) ========== */
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            using var con = _context.CreateConnection();

            await con.ExecuteAsync(
                "SP_order",
                new { flag = 3, id, status },
                commandType: CommandType.StoredProcedure
            );

            return Ok("Order status updated");
        }

        /* ========== DELETE ORDER ========== */
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            using var con = _context.CreateConnection();

            await con.ExecuteAsync(
                "SP_order",
                new { flag = 4, id },
                commandType: CommandType.StoredProcedure
            );

            return Ok("Order deleted");
        }
    }
}
