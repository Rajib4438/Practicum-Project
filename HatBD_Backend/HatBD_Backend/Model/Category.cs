using System;

namespace HatBD.Models
{
    public class Category
    {
        // ===== Table / SP =====
        public int id { get; set; }

        public string? name { get; set; }

        public string? createdby { get; set; }

        public DateTime? createdat { get; set; }

        public string? updatedby { get; set; }

        public DateTime? updatedat { get; set; }

        public bool? isactive { get; set; }

        public bool? isdelete { get; set; }

        // ===== Stored Procedure Control =====
        public int flag { get; set; }
    }
}
