using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Model;

namespace Controllers;

public class UserHub : Hub
{
    private readonly UserContext _context;

    public UserHub(UserContext context)
    {
        _context = context;
    } 

    public async Task GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        await Clients.Caller.SendAsync("Users", users);
    }
}