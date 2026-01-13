namespace HatBD_Backend.Model
{
    public class Rider
    {
        public int RiderId { get; set; }
        public int DistrictId { get; set; }
        public int ThanaId { get; set; }
        public int AreaId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
    }
}
