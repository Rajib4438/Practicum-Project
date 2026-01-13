using HatBD_Backend.Context;
using HatBD_Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the Bkashhhh.
builder.Services.AddHttpClient<HatBD_Backend.Services.BKashService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<DapperContext>();
builder.Services.AddScoped<EmailService>();

//Bkashshsss
builder.Services.AddScoped<HatBD_Backend.Services.IBKashService,
    HatBD_Backend.Services.BKashService>();


builder.Services.AddCors(option =>
{
    option.AddPolicy("SpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("SpecificOrigins");
app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
