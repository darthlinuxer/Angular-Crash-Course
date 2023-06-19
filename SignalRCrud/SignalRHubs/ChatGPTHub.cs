using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Models;
using Newtonsoft.Json;

namespace Controllers;

/// <summary>
/// ChatGPTSignalR Hub
/// </summary>
public class ChatGPTHub : Hub
{
    private readonly ChatGPTController controller;
    private readonly IHttpClientFactory _factory;

    /// <summary>
    /// ChatGPT SignalR Hub
    /// </summary>
    /// <param name="controller"></param>
    /// <param name="factory"></param>
    public ChatGPTHub(
        ChatGPTController controller,
        IHttpClientFactory factory
        )
    {
        this.controller = controller;
        this._factory = factory;
    }
    /// <summary>
    /// Simple SignalR question example without HISTORY
    /// </summary>
    /// <param name="prompt"></param>
    /// <param name="model"></param>
    /// <param name="max_tokens"></param>
    /// <returns></returns>
    public async Task SendMessage(string prompt, string model = "gpt-3.5-turbo", int max_tokens = 1000)
    {
        if (string.IsNullOrEmpty(prompt)) prompt = "Say something nice";
        var result = await controller.SimpleReply(prompt, model, max_tokens);
        if (result is OkObjectResult okresult)
        {
            await Clients.Caller.SendAsync("ReceiveData", okresult.Value);
        }
        else if (result is BadRequestObjectResult badRequestResult)
        {
            var error = badRequestResult.Value;
            string json = JsonConvert.SerializeObject(error);
            Console.WriteLine("Error {0}", json);
        }
    }

    /// <summary>
    /// Send a completion object and receive back a stream of data
    /// </summary>
    /// <param name="completion"></param>
    /// <returns></returns> 
    public async Task SendStreamedMessage(Completion completion)
    {
        var stopwatch = new Stopwatch();
        stopwatch.Start();
        completion.Stream = true;

        using var client = _factory.CreateClient("defaultGPT");
        var body = completion;

        var response = await client.PostAsJsonAsync(client.BaseAddress + "/v1/chat/completions", body);

        if (response.IsSuccessStatusCode)
        {
            using var streamReader = new StreamReader(await response.Content.ReadAsStreamAsync());
            while (!streamReader.EndOfStream)
            {
                var result = await streamReader.ReadLineAsync();
                if (result == null) continue;        
                Console.WriteLine("result {0}", result);    
                await Clients.Caller.SendAsync("ReceiveStreamedData", result);
            }
            Console.WriteLine($"Elapsed:{stopwatch.ElapsedMilliseconds}");
        }
    }

    /// <summary>
    /// Send a completion object with history of messages
    /// </summary>
    /// <param name="completion"></param>
    /// <returns></returns> 
    public async Task SendCompletion(Completion completion)
    {
        completion.Stream = false;
        var result = await controller.Completions(completion);
        if (result is OkObjectResult okresult)
        {
            await Clients.Caller.SendAsync("ReceiveData", okresult.Value);
        }
        else if (result is BadRequestObjectResult badRequestResult)
        {
            var error = badRequestResult.Value;
            string jsonError = JsonConvert.SerializeObject(error);
            Console.WriteLine("Error {0}", jsonError);
            await Clients.Caller.SendAsync("Error", jsonError);
        }


    }
}