import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrivenformsComponent } from './drivenforms/drivenforms.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveformsComponent } from './reactiveforms/reactiveforms.component';

const routes: Routes = [
  { path: "drivenforms", component: DrivenformsComponent },
  { path: "reactiveforms", component: ReactiveformsComponent },
];


@NgModule({
  declarations: [
    DrivenformsComponent,
    ReactiveformsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CustomformsmoduleModule { }
