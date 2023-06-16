import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { Subject, map, scan, tap } from 'rxjs';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGptComponent implements OnInit {

  subject = new Subject<string>();
  data$ = this.subject.pipe(
    scan((acc, value) => {
      if (value === "clear_response") return '';
      return acc + value
    }, '')
  );
  prompt: string = "";
  constructor(
    private signalR: SignalRService,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.signalR.chatgptHubConn.on("ReceiveData", (data: any) => {
      let content = data.choices[0]?.message?.content;
      if (typeof (content) != undefined) { this.subject.next(content); }
    });

    this.signalR.chatgptHubConn.on("ReceiveStreamedData", (data: any) => {
      let obj = JSON.parse(data);
      let content = obj?.choices[0]?.delta?.content;
      if (typeof (content) != undefined) { this.subject.next(content); }
    });
  }

  ngAfterViewInit(): void {
    this.signalR.chatgptHubConn.start().then(() => {
      console.log("SignalR connection made");
    }).catch(error => console.log(error));
  }

  SubmitHttp() {
    this.subject.next("clear_response");
    if (this.prompt === null || this.prompt.length === 0) {
      this.subject.next("Aren't you gonna ask something?");
      return;
    }
    this.http.post("ChatGPT/Completions", {
      messages: [
        {
          role: "user",
          content: this.prompt
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 1000
    }).pipe(
      tap(c => console.log(c)),
      map(c => {
        if (c.choices?.length > 0) { return c.choices[0].message.content; }
      })
    ).subscribe(data => this.subject.next(data));
  }

  SubmitHttpReceiveStream() {
    this.subject.next("clear_response");
    let message = {
      messages: [
        {
          role: "user",
          content: this.prompt
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 1000
    };
    if (this.prompt === null || this.prompt.length === 0) {
      this.subject.next("Aren't you gonna ask something?");
    } else
      this.signalR.chatgptHubConn.send("SendStreamedMessage", message);
  }

  SubmitSignalR() {
    this.subject.next("clear_response");
    if (this.prompt === null || this.prompt.length === 0) {
      this.subject.next("Aren't you gonna ask something?");

    } else
      this.signalR.chatgptHubConn.send("SendMessage", this.prompt, "gpt-3.5-turbo", 1000);
  }
}