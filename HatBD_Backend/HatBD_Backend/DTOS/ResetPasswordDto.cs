namespace HatBD_Backend.DTOs
{
    public class ResetPasswordDto
    {
        public string Token { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
