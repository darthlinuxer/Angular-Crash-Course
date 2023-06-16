import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { User } from '../models/user';
import { HttpService } from '../services/http.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.css'],
  providers: [SignalRService, HttpService]
})
export class DynamictableComponent implements OnInit, AfterViewInit {

  data$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(
    private signalR: SignalRService,
    private http: HttpService) {

  }

  ngOnInit() {
    this.signalR.userHubConn.on("UserAdded", (newUser: User) => {
      console.log("NewUser:", newUser);
      const currentUsers = this.data$.getValue();
      const users = [...currentUsers, newUser];
      this.data$.next(users)
    });
    this.signalR.userHubConn.on("UserDeleted", (deletedUser: User) => {
      console.log("DeletedUser", deletedUser);
      const currentUsers = this.data$.getValue();
      const users = currentUsers.filter(c => c.id !== deletedUser.id);
      this.data$.next(users);

    });
    this.signalR.userHubConn.on("UserUpdated", (updatedUser: User) => {
      console.log("UpdatedUser", User);
      let currentUsers = this.data$.getValue();
      const index = currentUsers.findIndex(user => user.id == updatedUser.id);
      if (index !== -1) {
        currentUsers[index] = updatedUser;
        this.data$.next(currentUsers);
      }
    });
  }

  ngAfterViewInit(): void {
    this.signalR.userHubConn.start().then(() => {
      this.fetchData();
    });
  }

  fetchData() {
    this.http.get<User[]>("api/User").then((users: User[]) => this.data$.next(users));
  }

  OnDestroy() {
  }

  // CRUD functions go here
  edit(user: User) {
    console.log("User to be Edited", user);
  }

  delete(user: User) {
    console.log("Delete button pressed!");
    this.http.delete("api/User", user.id.toString())
  }

}
