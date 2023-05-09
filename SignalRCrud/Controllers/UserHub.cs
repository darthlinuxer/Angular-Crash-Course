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

    // public async Task AddUser(User user)
    // {
    //     _context.Users.Add(user);
    //     await _context.SaveChangesAsync();
    //     await Clients.All.SendAsync("UserAdded", user);
    // }

    // public async Task EditUser(User user)
    // {
    //     _context.Users.Update(user);
    //     await _context.SaveChangesAsync();
    //     await Clients.All.SendAsync("UserEdited", user);
    // }

    // public async Task DeleteUser(int id)
    // {
    //     var user = await _context.Users.FindAsync(id);
    //     if (user is null)
    //     {
    //         await Clients.Caller.SendAsync("Error", "User with id:{id} does not exist!");
    //         return;
    //     }
    //     _context.Users.Remove(user);
    //     await _context.SaveChangesAsync();
    //     await Clients.All.SendAsync("UserDeleted", user);
    // }

    public async Task GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        await Clients.Caller.SendAsync("Users", users);
    }
}