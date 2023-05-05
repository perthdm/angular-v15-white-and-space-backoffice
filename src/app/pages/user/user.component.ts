import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUser, IUserPagination } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  dataList: IUser[] | any;
  userData: any = {};
  gender: string = '';
  dob: Date | any = null;

  isLoading: boolean = true;
  isVisible: boolean = false;
  isEdit: boolean = false;

  // === PAGINATION === //
  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  total: number = 0;

  dateFormat = 'dd-MM-YYYY';

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

    this.userService.getAllUser(pageConfig).subscribe(
      (res) => {
        let { total, page, last_page, items } = res;
        items.map((us: IUser) => {
          us.createdAt = formatDateTime(us.createdAt);
          us.updatedAt = formatDateTime(us.updatedAt);
        });
        this.dataList = items;
        this.total = total;
        this.isLoading = false;
      },
      (err) => {
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        );
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  resetData = () => {
    this.userData = {};
    this.gender = '';
    this.dob = null;
  };

  handleSubmitData(): void {
    if (!this.isEdit) {
      let reqData = {
        ...this.userData,
        dob: this.dob,
        gender: this.gender,
      };

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
    } else {
      let reqUpdateData = {
        id: this.userData._id,
        name: this.userData.name,
        telephone: this.userData.telephone,
        salary: this.userData.salary,
        dob: this.dob,
        gender: this.gender,
      };

      this.userService.updateUser(reqUpdateData).subscribe(
        (res) => {
          this.resetData();
          this.fetchUser();
        },
        (err) => {}
      );
    }

    this.isVisible = false;
  }

  handleCancel(): void {
    this.resetData();
    this.isVisible = false;
    this.isEdit = false;
  }

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchUser();
  }

  handleEditUser(usData: IUser) {
    this.userData = usData;
    this.dob = usData.dob;
    this.gender = usData.gender;
    this.isEdit = true;
    this.isVisible = true;
  }

  onChangeData(e: any) {
    let { name, value } = e.target;
    if (name === 'telephone') value = value.replace(/\D|\+|-/g, '');
    if (name === 'salary') value = +value;

    this.userData = {
      ...this.userData,
      [name]: value,
    };
  }
}
