namespace HatBD_Backend.Models
{
    public class Area
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }

        public string ThanaName { get; set; }
        public string DistrictName { get; set; }
        public object? ThanaId { get; internal set; }
    }
}
