import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() childData: string ="";
  @Output() childEventToParent = new EventEmitter<string>();

  private message:string = "";
  public count:number = 1; 
  
  constructor(
    private notification: NotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
  }

  ngOnInit(): void {
   
  }

  sendEvent() {
    this.message = 'Title'+this.count;    
    this.childEventToParent.emit(this.message);    
    this.notification.emitChildEvent(this.message);
    this.count++;
  }

  resetCounter() {
    this.count = 0;
    this.changeDetectorRef.detectChanges();
  }

}
