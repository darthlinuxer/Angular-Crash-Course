import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';
import { ParentComponent } from '../parent/parent.component';

@Component({
  selector: 'app-grandparent',
  templateUrl: './grandparent.component.html',
  styleUrls: ['./grandparent.component.css']
})
export class GrandparentComponent implements OnInit, OnDestroy {

  title: string="";
  @ViewChild(ParentComponent) parent!: ParentComponent;
  private childEventSubscription!: Subscription;  
  isSubscribed:boolean= false;
  
  constructor(
    private notification: NotificationService
  ) { 
    
  }

  ngOnInit(): void {          
    this.SubscribeToNotification();
  }

  SubscribeToNotification(){
    this.childEventSubscription = this.notification.childEvent$.subscribe(
      event => {                
        return this.onCustomEvent(event);
      }
    );
    console.log("Grandparent subscribed to notification service");
    this.isSubscribed = true;
  }

  UnSubscribeToNotification(){
    this.childEventSubscription.unsubscribe();
    this.isSubscribed=false;
  }

  ngOnDestroy() {
    this.childEventSubscription.unsubscribe();  
    console.log('Grandparent unsubscribed from Notification service');
  }

  onCustomEvent(event: string): void {
    console.log('GranParent received event from child component:', event);
    this.title = event;
  }

  ResetCounter()
  {
    this.parent.resetChildCounter();
  }


}
