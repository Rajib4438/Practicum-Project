using System;

namespace HatBD.Models
{
    public class SubCategory
    {
        // ===== SP control =====
        public int? flag { get; set; }

        // ===== table fields =====
        public int? id { get; set; }

        public string? name { get; set; }

        public string? createdby { get; set; }

        public DateTime? createdat { get; set; }

        public string? updatedby { get; set; }

        public DateTime? updatedat { get; set; }

        public bool? isactive { get; set; }

        public bool? isdelete { get; set; }

        public int? categoryid { get; set; }

        // ===== extra (join result) =====
        public string? categoryName { get; set; }
    }
}
