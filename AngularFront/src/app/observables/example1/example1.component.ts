import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, from, fromEvent, interval, map, mapTo, merge, of, reduce, scan, takeUntil, tap, throwError, zip } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { __values } from 'tslib';

@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.css']
})
export class Example1Component implements OnInit, OnDestroy {

  public finiteObservable$: Observable<string[]>;
  public infiniteObservable$: Observable<string[]>;
  public counter$: Observable<number> = new Observable<number>(subscriber => {
    let i: number = 0;
    let interval = setInterval(() => {
      i++;
      if (i >= 10) subscriber.error(new Error("Numbers above 10 are not allowed"));
      this.counter = i;
      subscriber.next(i);
    }, 1000)
    return () => {
      console.log("Teardown called!");
      clearInterval(interval);
    }
  });

  private streamSubscription!: Subscription;
  private counterSubscription!: Subscription;
  public fullnames: string[] = [];
  public counter: number = 0;

  constructor() {

    // Hard Code Example
    // this.finiteObservable$ = new Observable<string[]>(subscriber => {
    //   console.log("Observable Executed!");
    //   let values = ["Aquaman"];
    //   subscriber.next(values);
    //   setTimeout(() => {
    //     values.push("Superman");
    //     subscriber.next(values);
    //   }, 1000);
    //   setTimeout(() => {
    //     values.push("Ironman");
    //     subscriber.next(values);
    //   }, 2000);
    //   setTimeout(() => {
    //     values.push("Spiderman");
    //     subscriber.next(values);
    //   }, 3000);
    //   setTimeout(() => {
    //     subscriber.complete();
    //     console.log("Finite Observer has completed!")
    //   }, 4000);
    //   return () => { console.log('Finite Observable Teardown') }
    // });

    // This way there is no timer and values will be emited at once
    // this.finiteObservable$ = of("Aquaman","Superman","Ironman","Spiderman").pipe(
    //   reduce((acc:string[], value:string)=> {
    //     acc.push(value);
    //     return acc;
    //   },[])
    // );

    this.finiteObservable$ = zip(
      of("Aquaman","Superman","Ironman","Spiderman"),
      interval(1000),
      (val,i) => val
    ).pipe(
      scan((acc:string[], value:string)=> {
             acc.push(value);
             return acc;
           },[])
    );

    this.infiniteObservable$ = interval(2000).pipe(
      map((value) => {
        console.log(value);
        const ajax$ = ajax<any>("https://random-data-api.com/api/name/random_name");
        ajax$.subscribe((c:any)=>this.fullnames.push(c.response.name));
        return this.fullnames;
      }));

    this.counterSubscription = this.counter$.subscribe({
      next: value => console.log(value),
      error: err => console.log(err),
      complete: () => console.log("Observer Counter has completed!")
    })

  }
  ngOnDestroy(): void {
    this.streamSubscription.unsubscribe();
    this.counterSubscription.unsubscribe();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  Subscribe() {
    this.streamSubscription = this.infiniteObservable$.subscribe(
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
