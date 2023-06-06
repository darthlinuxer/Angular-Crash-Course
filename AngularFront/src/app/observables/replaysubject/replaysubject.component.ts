import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-replaysubject',
  templateUrl: './replaysubject.component.html',
  styleUrls: ['./replaysubject.component.css']
})
export class ReplaysubjectComponent implements OnInit {

  replaySubject$ = new ReplaySubject(3);

  constructor() { }

  ngOnInit(): void {
    this.replaySubject$.next('Value 1');
    this.replaySubject$.next('Value 2');
    this.replaySubject$.next('Value 3');    
  }

  ngAfterViewInit(){
    this.replaySubject$.subscribe((value) => {
      console.log('Subscriber 1:', value);
    });
    this.replaySubject$.next('Value 4');
    this.replaySubject$.subscribe((value) => {
      console.log('Subscriber 2:', value);
    });
    this.replaySubject$.next('Value 5');
  }

}
