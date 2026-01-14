namespace HatBD_Backend.Model
{
    public class Rider
    {
        public int RiderId { get; set; }

        public int UserId { get; set; }          // 🔥 optional mapping
        public int SellerId { get; set; }        // 🔥 NEW

        public int DistrictId { get; set; }
        public int ThanaId { get; set; }
        public int AreaId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
    }
}
