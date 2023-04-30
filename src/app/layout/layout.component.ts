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
    this.fetchUserProfile();
    let currentRole = localStorage.getItem('role');
    if (currentRole === 'owner' || currentRole === 'manager') {
      this.isFullAccess = true;
    }
  }

  fetchUserProfile() {
    this.usService.getProfile().subscribe((res) => {
      let { name, is_check_in, _id } = res;
      this.userId = _id;
      if (!is_check_in) {
        this.isShowModalCheckIn = true;
      }
      localStorage.setItem('name', name);
    });
  }

  handleCheckIn() {
    if (this.userId) {
      this.usService.employeeAttendance(this.userId).subscribe(
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
