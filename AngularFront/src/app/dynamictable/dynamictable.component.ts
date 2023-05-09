import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { User } from '../models/user';
import { HttpService } from '../services/http.service';
import { Observable, concat, map, scan } from 'rxjs';

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

  ngOnInit() {
    this.signalR.userHubConn.on("UserAdded", (newUser:User) => {
      this.data = this.data!.pipe(
        map((users: User[]) => [...users, newUser])
      )});
      this.signalR.userHubConn.on("UserDeleted", (deletedUser:User) => {
        this.data = this.data!.pipe(
          map((users: User[]) => users.filter(user => user.id !== deletedUser.id))
        )});
        this.signalR.userHubConn.on("UserUpdated", (updatedUser:User) => {
          this.data = this.data!.pipe(
            map((users: User[]) => users.map(user => {
              if (user.id === updatedUser.id) {
                return updatedUser;
              } else {
                return user;
              }
            }))
          );
        });
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
    console.log("Delete button pressed!");
    this.http.delete("user",user.id.toString())
  }

}
