import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Staff } from 'src/app/model/staff.model';
import { User, UserPagination } from 'src/app/model/user.model';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  dataList: User[] | any;
  currentPage: number = 1;
  pageLimit: number = 10;
  total: number = 0;
  isLoading: boolean = true;
  isVisible: boolean = false;

  loginForm!: FormGroup;
  username?: string;
  password?: string;

  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.getAllUser(this.currentPage, this.pageLimit).subscribe(
      (res) => {
        console.log(res);
        let { total, page, last_page, items } = res;
        items.map((us: User) => {
          us.createdAt = formatDateTime(us.createdAt);
          us.updatedAt = formatDateTime(us.updatedAt);
        });
        this.dataList = items;
        this.currentPage = 1;
        this.total = total;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  resetData = () => {
    this.username = '';
    this.password = '';
  };

  handleSubmitData(): void {
    console.log('username ==> ', this.username);
    console.log('password ==> ', this.password);

    if (this.username && this.password) {
      let reqData = { username: this.username, password: this.password };
      this.userService.addUser(reqData).subscribe(
        (res) => {
          console.log(res);
          this.resetData();
          this.fetchUser();
          this.message.create('success', `เพิ่มผู้ใช้งานสำเร็จ`);
        },
        (err) =>
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          )
      );
    }

    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
