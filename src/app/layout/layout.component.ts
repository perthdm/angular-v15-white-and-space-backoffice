import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  logout() {
    console.log('CLEAR');
    localStorage.clear();
    // this.router.navigate(['/login']);
  }
}
