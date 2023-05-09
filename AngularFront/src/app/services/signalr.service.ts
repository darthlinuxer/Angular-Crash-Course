import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private apiUrl = 'http://localhost:5185';
  public connection!: signalR.HubConnection;

  constructor(
  ) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + '/userHub')
      .build();

    this.connection.onclose(() => {
      console.log('SignalR connection closed');
    });
  }

  ngOnInit() {

  }

}
