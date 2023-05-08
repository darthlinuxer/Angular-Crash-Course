import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _childEvent: Subject<string> = new Subject<string>();
  childEvent$ = this._childEvent.asObservable();

  constructor() { }

  emitChildEvent(event: string): void {
    this._childEvent.next(event);
  }
}
