using Dapper;
using HatBD_Backend.Context;
using HatBD_Backend.DTOs;
using HatBD_Backend.Model;
using HatBD_Backend.Models;
using HatBD_Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DapperContext _context;
        private IBKashService _bKashService;

        public OrderController(DapperContext context, IBKashService bKashService)
        {
            _context = context;
            _bKashService = bKashService;
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
        /* ========== assigen order ========== */

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
         {
            try
            {
                using var con = _context.CreateConnection();

                var result = await con.QueryFirstOrDefaultAsync(
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
                        totaldiscount = dto.TotalDiscount,

                        // ✅ NEW (SP requires these)
                        DistrictId = dto.DistrictId,
                        ThanaId = dto.ThanaId,
                        AreaId = dto.AreaId
                    },
                    commandType: CommandType.StoredProcedure
                );

                if (result != null && dto.cartIds != null)
                {
                    foreach (var item in dto.cartIds)
                    {
                        await con.QueryFirstOrDefaultAsync(
                            "SP_order_item",
                            new
                            {
                                flag = 1,
                                orderid = result.OrderId,
                                cartId = item
                            },
                            commandType: CommandType.StoredProcedure
                        );
                    }
                    if(dto.PaymentMethod == "Bkash")
                    {
                        var bkash = await _bKashService.InitiatePaymentAsync(new PaymentRequest
                        {
                            Amount = dto.TotalPrice,
                            Currency = "BDT",
                            MerchantInvoiceNumber = $"INV-{result.OrderId}-{DateTime.UtcNow.Ticks}",
                            SuccessUrl = "http://localhost:4200/payment-confirmation"
                        });
                        await con.QueryFirstOrDefaultAsync(
               "SP_order",
               new
               {
                   flag = 8,
                   id = result.OrderId,
                   bkashTrans = bkash.PaymentId
               },
               commandType: CommandType.StoredProcedure
           );
                        return Ok(new { data = bkash, orderId = result.OrderId });
                    } 
                    return Ok(new { msg = "Order created successfully", orderId = result.OrderId });

                }



                return BadRequest(new { msg = "Error" });

            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }


        [HttpGet("Success_URL")]
        public async Task<IActionResult> SuccessUrl(string paymemtId)
        {
            try
            {
                var bkash = await _bKashService.ExecutePaymentAsync(paymemtId);
                using var con = _context.CreateConnection();
                await con.QueryFirstOrDefaultAsync(
                          "SP_order",
                          new
                          {
                              flag = 9,
                              bkashTrans = paymemtId
                          },
                          commandType: CommandType.StoredProcedure
                      );


                return Ok(bkash);
            }
            catch (Exception ex)
            {

                throw;
            }
        
        }


        /* ========== UPDATE ORDER STATUS (ADMIN) ========== */
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
    int id,
    [FromBody] Order dto)
        {
            using var con = _context.CreateConnection();

            await con.ExecuteAsync(
                "SP_order",
                new { flag = 3, id, status = dto.Status },
                commandType: CommandType.StoredProcedure
            );

            return Ok(new { msg= "Order status updated" });
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

        /* ========== GET ORDERS BY USER ID (USER PANEL) ========== */
        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            using var con = _context.CreateConnection();

            var orders = await con.QueryAsync(
                "SP_order",
                new
                {
                    flag = 6,
                    userid = userId
                },
                commandType: CommandType.StoredProcedure
            );

            return Ok(orders);
        }

        /* ========== GET SELLER'S SOLD PRODUCTS ========== */
        [HttpGet("seller/{sellerId:int}")]
        public async Task<IActionResult> GetSellerSoldProducts(int sellerId)
        {
            using var con = _context.CreateConnection();

            var soldProducts = await con.QueryAsync(
                "SP_order",
                new
                {
                    flag = 7,
                    sellerId
                },
                commandType: CommandType.StoredProcedure
            );

            return Ok(soldProducts);
        }

    }
}
