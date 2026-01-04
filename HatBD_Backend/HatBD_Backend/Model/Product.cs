using System;

namespace HatBD.Models
{
    public class Product
    {
        // ===== SP control =====
        public int flag { get; set; }

        // ===== Table fields =====
        public int id { get; set; }

        public string? name { get; set; }

        public string? brand { get; set; }

        public string? description { get; set; }

        public decimal price { get; set; }

        public int stockquantity { get; set; }

        public string? status { get; set; }

        public string? ImageName {  get; set; }
        public IFormFile? Image { get; set; }

        public string? createdby { get; set; }

        public DateTime? createdat { get; set; }

        public string? updatedby { get; set; }

        public DateTime? updatedat { get; set; }

        public bool isactive { get; set; }

        public bool isdelete { get; set; }

        public int categoryid { get; set; }

        public int subcategoryid { get; set; }
        public string? ImageLocation { get; set; }

        // ===== Extra (JOIN result) =====
        public string? categoryName { get; set; }

        public string? subCategoryName { get; set; }
        public bool isApprove { get; set; }
    }
}
