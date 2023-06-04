import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { GrandparentComponent } from './grandparent/grandparent.component';
import { NotificationService } from './services/notification.service';
import { FormsModule } from '@angular/forms';
import { DynamictableComponent } from './dynamictable/dynamictable.component';
import { HttpClientModule } from '@angular/common/http';
import { Example1Component } from './observables/example1/example1.component';

@NgModule({
  declarations: [
    AppComponent,
    ParentComponent,
    ChildComponent,
    GrandparentComponent,
    DynamictableComponent,
    Example1Component
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
