using HatBD_Backend.Models;

namespace HatBD_Backend.Services
{
    public interface IBKashService
    {
        Task<PaymentResponse> InitiatePaymentAsync(PaymentRequest request);
        Task<PaymentResponse> ExecutePaymentAsync(string paymentId);
        Task<PaymentResponse> QueryPaymentAsync(string paymentId);
        Task<bool> VerifyPaymentAsync(PaymentCallback callback);
    }
}
