import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { GrandparentComponent } from './grandparent/grandparent.component';
import { NotificationService } from './services/notification.service';
import { FormsModule } from '@angular/forms';
import { DynamictableComponent } from './dynamictable/dynamictable.component';
import { HttpClientModule } from '@angular/common/http';
import { ObservablesModule } from './observables/observables.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'grandparent', component: GrandparentComponent},
  { path:'parent', component: ParentComponent},
  { path:'child', component: ChildComponent},
  { path:"table", component: DynamictableComponent},
  { path: '**', redirectTo: '/grandparent' }
];

@NgModule({
  declarations: [
    AppComponent,
    ParentComponent,
    ChildComponent,
    GrandparentComponent,
    DynamictableComponent    
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ObservablesModule,
    RouterModule.forRoot(routes)
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
