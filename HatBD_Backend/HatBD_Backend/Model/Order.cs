namespace HatBD_Backend.Model
{
    public class Order
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Status { get; set; }
        public string? PaymentMethod { get; set; }
        public decimal? TotalPrice { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? TotalDiscount { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
