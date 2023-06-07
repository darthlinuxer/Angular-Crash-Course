import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drivenforms',
  templateUrl: './drivenforms.component.html',
  styleUrls: ['./drivenforms.component.css']
})
export class DrivenformsComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };
  
  constructor() { }

  ngOnInit(): void {
  }

  submitForm() {
    // Handle form submission
    console.log('User:', this.user);
  }

}
