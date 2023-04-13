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

  total: number = 0;
  isLoading: boolean = true;
  isVisible: boolean = false;

  loginForm!: FormGroup;
  username?: string;
  password?: string;

  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  // expandedRowKeys: number[] = [];

  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
      query: this.query,
    };
    console.log(pageConfig);

    this.userService.getAllUser(pageConfig).subscribe(
      (res) => {
        let { total, page, last_page, items } = res;
        items.map((us: User) => {
          us.createdAt = formatDateTime(us.createdAt);
          us.updatedAt = formatDateTime(us.updatedAt);
        });
        console.log(items);

        this.dataList = items;
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
          // console.log(res);
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

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchUser();
  }

  // onExpandChange(expanded: boolean, index: number): void {
  //   if (expanded) {
  //     this.expandedRowKeys.push(index);
  //   } else {
  //     this.expandedRowKeys = this.expandedRowKeys.filter(
  //       (key) => key !== index
  //     );
  //   }
  // }

  // isRowExpanded(index: number): boolean {
  //   console.log(index);

  //   return this.expandedRowKeys.includes(index);
  // }
}
