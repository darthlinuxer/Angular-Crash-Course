import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-example2',
  templateUrl: './asyncsubject.component.html',
  styleUrls: ['./asyncsubject.component.css']
})
export class AsyncSubjectComponent implements OnInit, OnDestroy {

  asyncSubject$: AsyncSubject<string> = new AsyncSubject<string>();
  subscription!: Subscription;
  message!:string;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.asyncSubject$.next('Hello');
      this.asyncSubject$.next('World');
      this.asyncSubject$.complete();
    }, 1000);    
  }

  ngAfterViewInit(){
    setTimeout(()=> this.subscription = this.asyncSubject$.subscribe( value => this.message = value),2000);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
