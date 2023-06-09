import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidebarWrapper') sidebarWrapper!: ElementRef;
  @ViewChild('pageContentWrapper') pageContentWrapper!: ElementRef;
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      this.sidebarWrapper.nativeElement.style.width = '250px';
    } else {
      this.sidebarWrapper.nativeElement.style.width = '0';
    }
  }

}
