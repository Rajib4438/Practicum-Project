namespace HatBD_Backend.DTOs
{
    public class OrderCreateDto
    {
        public int UserId { get; set; }

        public string? Name { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public string? PaymentMethod { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal TotalDiscount { get; set; }
        public List<int>? cartIds { get; set; }  
    }
}
