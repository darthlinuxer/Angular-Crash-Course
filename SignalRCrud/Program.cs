using Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Model;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<UserContext>(options =>
    options.UseInMemoryDatabase("UserDb"));

builder.Services.AddSignalR();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    var filePath = Path.Combine(AppContext.BaseDirectory, "SignalRCrud.xml");
    c.IncludeXmlComments(filePath);
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
   {
       builder.WithOrigins("http://localhost:4200")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
   });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetService<UserContext>();
    context?.Database.EnsureCreated();

    if (!context.Users.Any())
    {
        var users = new List<User>
                {
                    new User { Id = 1, Name = "John", Surname = "Doe" },
                    new User { Id = 2, Name = "Jane", Surname = "Doe" },
                    new User { Id = 3, Name = "Bob", Surname = "Smith" }
                };
        context.Users.AddRange(users);
        context.SaveChanges();
    }
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();
app.MapHub<UserHub>("/userHub");

app.Run();
