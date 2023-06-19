import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { ReplaySubject, Subject, map, scan, tap } from 'rxjs';
import { HttpService } from '../services/http.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGptComponent implements OnInit {

  subject = new ReplaySubject<Message>();
  data$ = this.subject.pipe(
    scan((acc: Message[], value: Message) => {
      if (value.content === "clear_response") return [];
      acc.push(value);
      return acc;
    }, [])
  );

  prompt: string = "";
  private streamedRole: string = "";
  private streamedContent: string = "";
  constructor(
    private signalR: SignalRService,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.signalR.chatgptHubConn.on("ReceiveData", (data: any) => {
      if (data.choices?.length > 0) { data = new Message(data.choices[0].message.role, data.choices[0].message.content) }
      if (typeof (data) != undefined) { this.subject.next(data); }
    });
    this.signalR.chatgptHubConn.on("ReceiveStreamedData", (reply: any) => {            
      console.log("Reply", reply);
    });      
  }

  ngAfterViewInit(): void {
    this.signalR.chatgptHubConn.start().then(() => {
      console.log("SignalR connection made");
    }).catch(error => console.log(error));
  }

  SubmitHttp() {
    if (this.prompt === null || this.prompt.length === 0) {
      this.subject.next(new Message('', 'clear_response'));
      this.subject.next(new Message('assistant', 'Do you want to ask something?'));
      return;
    }

    let data = this.FetchSubjectHistory();
    this.http.post("ChatGPT/Completions", {
      messages: data,
      model: "gpt-3.5-turbo",
      max_tokens: 1000
    }).pipe(
      map(c => {
        if (c.choices?.length > 0) { return new Message(c.choices[0].message.role, c.choices[0].message.content) }
        return;
      })
    ).subscribe((data: any) => this.subject.next(data));
  }

  SubmitSignalR() {
    let message = this.PrepareCompletionMessage();
    this.signalR.chatgptHubConn.send("SendCompletion", message);
  }

  SubmitSignalRReceiveStream() {
    let message = this.PrepareCompletionMessage();   
    this.signalR.chatgptHubConn.send("SendStreamedMessage", message);
  }
 
  ClearChat() {
    this.subject.next(new Message('', 'clear_response'));
  }

  private FetchSubjectHistory():Message[]
  {
    this.subject.next(new Message('user', this.prompt));
    let data: Message[] = [];
    const temp = this.data$.subscribe(c => data = c);
    temp.unsubscribe();    
    return data;
  }

  private PrepareCompletionMessage():any{
    if (this.prompt === null || this.prompt.length === 0) {
      this.subject.next(new Message('', 'clear_response'));
      this.subject.next(new Message('assistant', 'Do you want to ask something?'));
      return;
    }
    let data = this.FetchSubjectHistory();
    let message = {
      messages: data,
      model: "gpt-3.5-turbo",
      max_tokens: 1000
    };
    return message;
  }

}