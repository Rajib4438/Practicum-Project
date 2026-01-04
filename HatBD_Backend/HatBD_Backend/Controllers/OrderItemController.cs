using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.DTOs;
using HatBD_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemController : ControllerBase
    {
        private readonly DapperContext _context;

        public OrderItemController(DapperContext context)
        {
            _context = context;
        }

        /* ================= GET ITEMS BY ORDER ================= */
        [HttpGet("order/{orderId:int}")]
        public async Task<IActionResult> GetItemsByOrder(int orderId)
        {
            try
            {
                using var con = _context.CreateConnection();

                var items = await con.QueryAsync<OrderItem>(
                    "SP_order_item",
                    new { flag = 0, orderid = orderId },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Failed to load order items",
                    Error = ex.Message
                });
            }
        }

        /* ================= CREATE ORDER ITEM ================= */
        [HttpPost]
        public async Task<IActionResult> CreateOrderItem([FromBody] OrderItemCreateDto dto)
        {
            try
            {
                using var con = _context.CreateConnection();

                var newId = await con.ExecuteScalarAsync<int>(
                    "SP_order_item",
                    new
                    {
                        flag = 1,
                        orderid = dto.OrderId,
                        productid = dto.ProductId,
                        quantity = dto.Quantity,
                        unitprice = dto.UnitPrice
                    },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new
                {
                    Message = "Order item created successfully",
                    OrderItemId = newId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Failed to create order item",
                    Error = ex.Message
                });
            }
        }

        /* ================= UPDATE ORDER ITEM ================= */
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOrderItem(int id, [FromBody] OrderItemCreateDto dto)
        {
            try
            {
                using var con = _context.CreateConnection();

                await con.ExecuteAsync(
                    "SP_order_item",
                    new
                    {
                        flag = 2,
                        id,
                        quantity = dto.Quantity,
                        unitprice = dto.UnitPrice
                    },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { Message = "Order item updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Failed to update order item",
                    Error = ex.Message
                });
            }
        }

        /* ================= DELETE ORDER ITEM ================= */
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            try
            {
                using var con = _context.CreateConnection();

                await con.ExecuteAsync(
                    "SP_order_item",
                    new { flag = 3, id },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { Message = "Order item deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Failed to delete order item",
                    Error = ex.Message
                });
            }
        }

        /* ================= DELETE ITEMS BY ORDER ================= */
        [HttpDelete("order/{orderId:int}")]
        public async Task<IActionResult> DeleteItemsByOrder(int orderId)
        {
            try
            {
                using var con = _context.CreateConnection();

                await con.ExecuteAsync(
                    "SP_order_item",
                    new { flag = 4, orderid = orderId },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { Message = "Order items deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Failed to delete order items",
                    Error = ex.Message
                });
            }
        }
    }
}
