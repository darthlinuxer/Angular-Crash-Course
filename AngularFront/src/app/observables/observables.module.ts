import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Example1Component } from './example1/example1.component';
import { AsyncSubjectComponent } from './asyncSubject/asyncsubject.component';
import { HotobservableComponent } from './hotobservable/hotobservable.component';
import { RouterModule, Routes } from '@angular/router';
import { ReplaysubjectComponent } from './replaysubject/replaysubject.component';


const routes: Routes = [
  { path: "simpleobservable", component: Example1Component },
  { path: "asyncsubject", component: AsyncSubjectComponent },
  { path: "replaysubject", component: ReplaysubjectComponent },
  { path: "canva", component: HotobservableComponent },
];

@NgModule({
  declarations: [
    Example1Component,
    AsyncSubjectComponent,
    HotobservableComponent,
    ReplaysubjectComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ObservablesModule { }
