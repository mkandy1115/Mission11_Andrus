// Matthew Andrus IS415 Mission 12
// This file serves as the ASP.NET Core startup configuration for the bookstore API.
using Microsoft.EntityFrameworkCore;
using Mission11_Andrus.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Register the API controllers, OpenAPI support, and the SQLite database context.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

var app = builder.Build();

// Enable OpenAPI in development and allow the React frontend to call this API.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(x => x.WithOrigins("http://localhost:3000"));

// Map incoming requests to the controller endpoints.
app.UseAuthorization();

app.MapControllers();

app.Run();
