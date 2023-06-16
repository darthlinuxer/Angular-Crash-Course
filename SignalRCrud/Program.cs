using System.Net.Http.Headers;
using System.Reflection;
using Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Model;
using Swashbuckle.AspNetCore.Filters;
using Swagger;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var env = builder.Environment;
if (env.IsDevelopment())
{
    builder.Configuration
        .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);
}

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
    options.AddPolicy("AngularHttps", builder =>
    {
        builder.WithOrigins("https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
    options.AddPolicy("Any", builder =>
    {
        builder.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient("defaultGPT", options =>
{
    options.BaseAddress = new Uri("https://api.openai.com");
    var api = configuration.GetValue<string>("OpenAIKey");
    if (string.IsNullOrEmpty(api)) throw new NullReferenceException("OpenAPIKey cannot be null or empty");
    options.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", api);
});

// Add services to the container.
builder.Services.AddDbContext<UserContext>(options =>
    options.UseInMemoryDatabase("UserDb"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "Angular Crash Course",
        Contact = new OpenApiContact
        {
            Name = "Camilo Chaves",
            Url = new Uri("https://linkedin.com/in/camilochaves")
        },
        License = new OpenApiLicense
        {
            Name = "Gnu License",
            Url = new Uri("https://www.gnu.org/licenses/agpl-3.0.txt")
        }
    });

    options.ExampleFilters();
    // Include XML comments if available
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

builder.Services.AddSwaggerExamplesFromAssemblyOf<CompletionsExample>();
builder.Services.AddSwaggerExamplesFromAssemblyOf<ImageExample>();
builder.Services.AddSignalR();
builder.Services.AddScoped<ChatGPTController>();

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

//app.UseAuthorization();

app.MapControllers();
app.MapHub<UserHub>("/UserHub");
app.MapHub<ChatGPTHub>("/ChatGPTHub");

app.Run();
