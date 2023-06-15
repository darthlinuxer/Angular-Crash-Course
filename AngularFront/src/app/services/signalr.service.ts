import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private apiUrl = 'http://localhost:5182';
  public userHubConn!: signalR.HubConnection;
  public chatgptHubConn!: signalR.HubConnection;

  constructor(
  ) {
    this.userHubConn = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + '/userHub')
      .build();
    
    this.chatgptHubConn = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + "/ChatGPTHub")
      .build();

    this.userHubConn.onclose(() => {
      console.log('SignalR connection closed');
    });
  }
}
