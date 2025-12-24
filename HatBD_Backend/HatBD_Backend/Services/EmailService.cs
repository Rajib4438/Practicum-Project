using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace HatBD_Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendResetPasswordEmail(
    string toEmail,
    string fullName,
    string resetLink)
        {
            try
            {
                var smtp = _config.GetSection("SmtpSettings");

                int port = int.TryParse(smtp["Port"], out var p) ? p : 587;

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(
                    smtp["FromName"] ?? "HatBD Support",
                    smtp["UserName"]
                ));

                email.To.Add(new MailboxAddress(fullName, toEmail));
                email.Subject = "Reset Your Password";

                email.Body = new TextPart("html")
                {
                    Text = $@"
            <h3>Hello {fullName},</h3>
            <p>You requested to reset your password.</p>
            <p>
              <a href='{resetLink}'
                 style='padding:10px 20px;
                        background:#0d6efd;
                        color:white;
                        border-radius:5px;
                        text-decoration:none'>
                 Reset Password
              </a>
            </p>
            <p>This link is valid for 15 minutes.</p>
            <br/>
            <b>HatBD Team</b>"
                };

                using var client = new SmtpClient();

                // ✅ TLS handshake fix (important for Gmail)
                client.ServerCertificateValidationCallback =
                    (s, c, h, e) => true;

                await client.ConnectAsync(
                    smtp["Host"],          // smtp.gmail.com
                    port,                  // 587
                    SecureSocketOptions.StartTls
                );

                await client.AuthenticateAsync(
                    smtp["UserName"],
                    smtp["Password"]       // Gmail App Password
                );

                await client.SendAsync(email);
                await client.DisconnectAsync(true);
                return true;
            }
            catch (SmtpCommandException smtpEx)
            {
                // SMTP command failed (auth, send, etc.)
                throw new Exception(
                    $"SMTP command error: {smtpEx.Message}", smtpEx);
            }
            catch (SmtpProtocolException protocolEx)
            {
                // TLS / protocol issues
                throw new Exception(
                    $"SMTP protocol error: {protocolEx.Message}", protocolEx);
            }
            catch (Exception ex)
            {
                // Any other error
                throw new Exception(
                    $"Email sending failed: {ex.Message}", ex);
            }
        }
    }
}
