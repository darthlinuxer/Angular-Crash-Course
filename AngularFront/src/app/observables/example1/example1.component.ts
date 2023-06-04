import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, fromEvent, interval, map, mapTo, merge, of, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.css']
})
export class Example1Component implements OnInit, OnDestroy {

  public names: string[] = ['John', 'Jane', 'David', 'Emily', 'Alice', 'Paul', 'Peter'];
  private surNames: string[] = ['Rambo', 'Fonda', 'Copperfield', 'Stone', 'Cooper', 'Joseph', 'Parker'];

  public name$: Observable<string[]>;
  public streamOfName$: Observable<string[]>;

  private streamSubscription!: Subscription;
  public fullnames: string[] = [];
 
  constructor() {
    this.name$ = new Observable<string[]>(subscriber => {
      console.log("Observable Executed!");
      let values = ["Aquaman"];
      subscriber.next(values);
      setTimeout(() => {
        values.push("Superman");
        subscriber.next(values);
      }, 1000);
      setTimeout(() => {
        values.push("Ironman");
        subscriber.next(values);
      }, 2000);
      setTimeout(() => {
        values.push("Spiderman");
        subscriber.next(values);
      }, 3000);
      setTimeout(() => {
        subscriber.complete();
        console.log("Finite Observer has completed!")
      }, 4000);
      return ()=>{console.log('Finite Observable Teardown')}
    });

    this.streamOfName$ = interval(2000).pipe(
      map((value) => {
        console.log(value);
        const randomNameIndex = Math.floor(Math.random() * this.names.length);
        const randomSurnNameIndex = Math.floor(Math.random() * this.surNames.length);
        this.fullnames.push(this.names[randomNameIndex] + " " + this.surNames[randomSurnNameIndex]);
        return this.fullnames;
      }));     
      
  }
  ngOnDestroy(): void {
    this.streamSubscription.unsubscribe();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    
  }

  Subscribe() {
    this.streamSubscription = this.streamOfName$.subscribe(
      {
        next: c => console.log(c),
        error: err => console.log(err),
        complete: () => console.log("Infinite Observer has completed!")
      });
    console.log("Subscribed to Infinite Stream")
  }
  UnSubscribe() {
    this.streamSubscription.unsubscribe();
    console.log("UnSubscribed to Infinite Stream")
  }

}
