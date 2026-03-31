// Matthew Andrus IS415 Mission 13
// This file serves as the ASP.NET Core startup configuration for the bookstore API.
using Microsoft.EntityFrameworkCore;
using Mission11_Andrus.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Register the API controllers, OpenAPI support, and the SQLite database context.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Mission 13: read allowed frontend origins from configuration so Azure URLs can be added without code changes.
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
    options.AddPolicy("AllowBookStoreApi", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));

var app = builder.Build();

// Enable OpenAPI in development and allow the React frontend to call this API.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowBookStoreApi");

app.UseHttpsRedirection();

app.UseAuthorization();

// Map incoming requests to the controller endpoints.
app.MapControllers();

app.Run();
