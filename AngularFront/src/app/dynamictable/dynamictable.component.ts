import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { User } from '../models/user';

@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.css']
})
export class DynamictableComponent implements OnInit, AfterViewInit {

  data!: User[] | undefined;

  constructor(private signalR: SignalRService) {
  
  }

  ngOnInit(){
    this.signalR.connection.on("Users", c=>
    this.data = c);
  }
  ngAfterViewInit(): void {
    this.signalR.connection.start().then(() => {      
      this.fetchData();
    });
  }

  fetchData() {
    this.signalR.connection.invoke("GetUsers");
  }

  // CRUD functions go here
  edit(item: any) { }

  delete(user: User) {
    this.signalR.connection.invoke("DeleteUser",user.id);
   }

}
