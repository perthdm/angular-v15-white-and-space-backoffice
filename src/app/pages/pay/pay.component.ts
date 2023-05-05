import { Component } from '@angular/core';
import { IUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent {
  userList: IUser | any = [];

  isShowModal: boolean = false;
  userSelected = null;
  selectedValue = null;
  value?: string;
  timeNormal?: string;
  timeOt?: string;
  numValue?: string;
  totalMoney?: string;
  netMoney?: string;
  inputValue?: string;
  size = 'default';

  dateRange: any = [];
  dateFormat = 'dd-MM-YYYY';

  constructor(private usService: UserService) {}

  ngOnInit() {}

  onChange(result: Date[]): void {
    this.fetchWorkInfoByUser();
  }

  showModal(): void {
    this.fetchUser();
    this.isShowModal = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isShowModal = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isShowModal = false;
  }

  fetchUser() {
    let pageConfig = { page: 1, limit: 200, query: '' };
    this.usService.getAllUser(pageConfig).subscribe((res: any) => {
      let { items } = res;
      this.userList = items;
    });
  }

  fetchWorkInfoByUser() {
    let reqConfig: any = {
      user_id: this.userSelected,
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };
    this.usService.getWorkInfo(reqConfig).subscribe((res: any) => {
      console.log(res);
    });
  }
}
