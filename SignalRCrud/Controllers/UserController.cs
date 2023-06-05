using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Model;

namespace Controllers;

/// <summary>
/// User Controller
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserContext _context;
    private readonly IHubContext<UserHub> signalRcontext;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="context"></param>
    /// <param name="signalRcontext"></param>
    public UserController(
        UserContext context, 
        IHubContext<UserHub> signalRcontext)
    {
        _context = context;
        this.signalRcontext = signalRcontext;
    }

    /// <summary>
    /// Get All Users
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    /// <summary>
    /// Get User with Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    /// <summary>
    /// Update user 
    /// </summary>
    /// <param name="id"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, User user)
    {
        if (id != user.Id)
        {
            return BadRequest();
        }

        _context.Entry(user).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await signalRcontext.Clients.All.SendAsync("UserUpdated", user);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    /// <summary>
    /// Create User
    /// </summary>
    /// <param name="user"></param>
    /// <returns>User</returns>
    [HttpPost]
    public async Task<ActionResult<User>> PostUser(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
         await signalRcontext.Clients.All.SendAsync("UserAdded", user);
        return CreatedAtAction("GetUser", new { id = user.Id }, user);
    }

    /// <summary>
    /// Delete User
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            Console.WriteLine($"User with id {id} not found");
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
         await signalRcontext.Clients.All.SendAsync("UserDeleted", user);
        return NoContent();
    }

    private bool UserExists(int id) => _context.Users.Any(e => e.Id == id);
}