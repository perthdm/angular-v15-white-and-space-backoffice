import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = true;
  isCheckIn: boolean = false;

  constructor(
    private router: Router,
    private usService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.usService.getProfile().subscribe((res) => {
      let { name, is_check_in } = res;
      if (!is_check_in) this.isCheckIn = true;
      localStorage.setItem('name', name);
    });
  }

  handleCheckIn() {
    this.usService.userAttendance().subscribe(
      (res) => {
        this.isCheckIn = false;
      },
      (err) => {
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        );
      }
    );
    Swal.fire('Success', 'คุณได้เช็คอินเข้างานแล้ว', 'success');
  }

  logout() {
    console.log('CLEAR');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
