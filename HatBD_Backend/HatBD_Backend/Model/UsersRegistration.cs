public class UserRegistration
{
    public int Id { get; set; }
    public string? RegisterAs { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
    public string? Gender { get; set; }

    public string? Address { get; set; } // ✅ New Address field
    public string? NID { get; set; } // 🔥 NEW
    public string? TradeLicense { get; set; } // 🔥 NEW
    public string? ShopAddress { get; set; } // 🔥 NEW
    public string? PermanentAddress { get; set; } // 🔥 NEW

    public DateTime CreatedAT { get; set; } = DateTime.Now;
    public bool IsApproved { get; set; } = false;

    // 🔐 FORGOT PASSWORD
    public string? ResetToken { get; set; }
    public DateTime? TokenExpiry { get; set; }
}
