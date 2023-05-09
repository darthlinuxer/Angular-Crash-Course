import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { GrandparentComponent } from './grandparent/grandparent.component';
import { DynamictableComponent } from './dynamictable/dynamictable.component';

const routes: Routes = [
  { path:'grandparent', component: GrandparentComponent},
  { path:'parent', component: ParentComponent},
  { path:'child', component: ChildComponent},
  { path:"table", component: DynamictableComponent},
  { path: '**', redirectTo: '/grandparent' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
