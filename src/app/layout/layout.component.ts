import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getStorage } from 'src/utils/utils';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = true;
  isShowModalCheckIn: boolean = false;
  isFullAccess: boolean = false;
  userId: string = '';

  constructor(
    private router: Router,
    private usService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchCheckInStatus();
    this.fetchUserProfile();
    let currentRole = localStorage.getItem('role');
    if (currentRole === 'owner' || currentRole === 'manager') {
      this.isFullAccess = true;
    }
  }

  fetchCheckInStatus() {
    this.usService.getCheckInStatus().subscribe((res) => {
      if (res) {
        let { check_in } = res;
        if (!check_in) this.isShowModalCheckIn = true;
      } else {
        this.isShowModalCheckIn = true;
      }
    });
  }

  fetchUserProfile() {
    this.usService.getProfile().subscribe((res) => {
      let { name, _id } = res;
      this.userId = _id;
      localStorage.setItem('name', name);
    });
  }

  handleCheckIn() {
    if (this.userId) {
      this.usService.checkIn(this.userId).subscribe(
        (res) => {
          this.isShowModalCheckIn = false;
          Swal.fire('Success', 'คุณได้เช็คอินเข้างานแล้ว', 'success');
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
  }

  logout() {
    console.log('CLEAR');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
