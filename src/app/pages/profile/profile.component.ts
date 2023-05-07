import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userData: IUser = {
    _id: '',
    username: '',
    role: '',
    name: '',
    telephone: '',
    salary: 0,
    gender: '',
    dob: '',
    is_check_in: false,
    status: '',
    type: '',
    createdAt: '',
    updatedAt: '',
  };

  isShowModal: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.userService.getProfile().subscribe((res) => {
      console.log(res);
      this.userData = res;
    });
  }

  genderString(gender: any) {
    return gender === 'male'
      ? 'ชาย'
      : gender === 'female'
      ? 'หญิง'
      : 'อื่นๆ / ไม่ระบุ';
  }

  mapDate(date: any) {
    return formatDateTime(date, 'onlyDate');
  }

  handleShowModal() {
    this.isShowModal = true;
  }

  handleSubmitData() {
    if (this.newPassword != this.confirmPassword) {
      this.message.error('กรุณากรอกรหัสผ่านให้ตรงกัน');
    }

    this.userService
      .changePwd(this.currentPassword, this.newPassword)
      .subscribe(
        (res) => {
          this.message.create('success', 'เปลี่ยนรหัสผ่านสำเร็จ');
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );

    this.handleCloseModal();
  }

  handleCloseModal() {
    this.isShowModal = false;
    this.resetData();
  }

  resetData() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
