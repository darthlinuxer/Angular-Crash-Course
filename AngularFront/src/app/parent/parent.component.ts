import { Component, OnInit, ViewChild } from '@angular/core';
import { ChildComponent } from '../child/child.component';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {

  public data = 'Data from Parent passed to Child!';
  public parentData: string = "";
  @ViewChild(ChildComponent) childComponent!: ChildComponent;
name: any;

  constructor() { 
  }

  ngOnInit(): void {
  }

  handleChildEvent(data: string) {
    this.parentData = data;
  }

  resetChildCounter(): void {
    this.childComponent.resetCounter();
  }

}
