using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using HatBD_Backend.Context;
using HatBD_Backend.Models;

namespace HatBD_Backend.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly DapperContext _context;

        public CartController(DapperContext context)
        {
            _context = context;
        }

        // ============================
        // POST: ADD TO CART
        // ============================
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] Cart cart)
        {
            try
            {
                using var connection = _context.CreateConnection();

             var data= await  connection.QueryFirstOrDefaultAsync(
                    "sp_Cart_Create",
                    new
                    {
                        cart.UserId,
                        cart.ProductId,
                        cart.Quantity
                    },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { message = "Added to cart successfully" ,data=data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================
        // GET: CART BY USER
        // ============================
        [HttpGet("{userId}")]
        public IActionResult GetCart(int userId)
        {
            try
            {
                using var connection = _context.CreateConnection();

                var cartItems = connection.Query<dynamic>(
                    "sp_Cart_GetByUser",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                ).ToList();

                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================
        // PUT: UPDATE CART
        // ============================
        [HttpPut("{cartId}")]
        public IActionResult UpdateCart(int cartId, [FromBody] int quantity)
        {
            try
            {
                using var connection = _context.CreateConnection();

                connection.Execute(
                    "sp_Cart_Update",
                    new
                    {
                        CartId = cartId,
                        Quantity = quantity
                    },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { message = "Cart updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================
        // DELETE: REMOVE CART ITEM
        // ============================
        [HttpDelete("{cartId}")]
        public IActionResult DeleteCart(int cartId)
        {
            try
            {
                using var connection = _context.CreateConnection();

                connection.Execute(
                    "sp_Cart_Delete",
                    new { CartId = cartId },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { message = "Cart deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================
        // PUT: INCREMENT CART ITEM
        // ============================
        [HttpGet("increment/{cartId}")]
        public IActionResult IncrementCart(int cartId)
        {
            try
            {
                using var connection = _context.CreateConnection();

                connection.Execute(
                    "sp_Cart_Increment",
                    new { CartId = cartId },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { message = "Cart item incremented successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================
        // PUT: DECREMENT CART ITEM
        // ============================
        [HttpGet("decrement/{cartId}")]
        public IActionResult DecrementCart(int cartId)
        {
            try
            {
                using var connection = _context.CreateConnection();

                connection.Execute(
                    "sp_Cart_Decrement",
                    new { CartId = cartId },
                    commandType: CommandType.StoredProcedure
                );

                return Ok(new { message = "Cart item decremented successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
