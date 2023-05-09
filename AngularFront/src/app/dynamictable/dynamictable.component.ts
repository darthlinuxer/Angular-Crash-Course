import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { User } from '../models/user';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.css']
})
export class DynamictableComponent implements OnInit, AfterViewInit {

  data!: Observable<User[]> | undefined;

  constructor(
    private signalR: SignalRService,
    private http: HttpService) {
  
  }

  ngOnInit(){
    this.signalR.userHubConn.on("Users", c=>
    this.data = c);
  }
  
  ngAfterViewInit(): void {
    this.signalR.userHubConn.start().then(() => {      
      this.fetchData();
    });
  }

  fetchData() {
    this.data = this.http.get<User[]>("user");
  }

  // CRUD functions go here
  edit(item: any) { }

  delete(user: User) {
    this.signalR.userHubConn.invoke("DeleteUser",user.id);
   }

}
