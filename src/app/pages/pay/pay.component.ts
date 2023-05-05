import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent {
  userList: IUser | any = [];
  dataList: any = [];
  isShowModal: boolean = false;
  userSelected = null;
  value?: string;

  netMoney?: string;
  size = 'default';

  dateRange: any = [];
  dateFormat = 'dd-MM-YYYY';

  timeNormal?: any;
  timeOt?: any;
  payValue?: any;
  selectedOption = 'default';
  optionalValue?: any;
  totalPay?: any;
  info: string = '';

  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  total: number = 0;

  constructor(
    private usService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchPayCycle();
  }

  fetchPayCycle() {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
      query: this.query,
    };
    this.usService.getPayCycle(pageConfig).subscribe((res) => {
      let { items, total } = res;
      this.dataList = items;
      console.log(items);

      this.total = total;
    });
  }

  onChange(result: Date[]): void {
    this.fetchWorkInfoByUser();
  }

  showModal(): void {
    this.fetchUser();
    this.isShowModal = true;
  }

  handleCloseModal(): void {
    this.isShowModal = false;
    this.resetData();
  }

  resetData() {
    this.timeNormal = null;
    this.timeOt = null;
    this.payValue = 0;
    this.optionalValue = 0;
    this.selectedOption = 'default';
    this.totalPay = 0;
    this.info = '';
    this.dateRange = [];
    this.userSelected = null;
  }

  handleSubmitData(): void {
    console.log('Button ok clicked!');
    let reqData = {
      user_id: this.userSelected,
      pay_amount: this.totalPay,
      info: this.info,
    };

    this.usService.createPay(reqData).subscribe(
      (res) => {
        this.fetchPayCycle();
        this.handleCloseModal();
        this.message.create('success', 'เพิ่มรายการจ่ายสำเร็จ');
      },
      (err) => {
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        );
      }
    );
    this.isShowModal = false;
  }

  handleChangeOption() {
    this.optionalValue = 0;
    this.totalPay = this.payValue;
  }

  adjustValue(event: any) {
    let { value } = event.target;
    this.totalPay = this.payValue;
    let next = parseInt(this.payValue);
    let eventVal = value ? parseInt(value) : 0;
    let nextValue = 0;

    if (this.selectedOption === 'inc') {
      nextValue = next + eventVal;
    } else if (this.selectedOption === 'dec') {
      nextValue = next - eventVal;
    }

    this.totalPay = nextValue;
  }

  fetchUser() {
    let pageConfig = { page: 1, limit: 200, query: '' };
    this.usService.getAllUser(pageConfig).subscribe((res: any) => {
      let { items } = res;
      this.userList = items;
      this.fetchPayCycle();
    });
  }

  fetchWorkInfoByUser() {
    let reqConfig: any = {
      user_id: this.userSelected,
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };
    this.usService.getWorkInfo(reqConfig).subscribe((res: any) => {
      let { normmal_hours, ot_hours, pay } = res;
      this.timeNormal = normmal_hours ? normmal_hours : 0;
      this.timeOt = ot_hours ? ot_hours : 0;
      this.payValue = pay ? pay : 0;
      this.totalPay = pay;
    });
  }

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchPayCycle();
  }

  mapDate(date: any) {
    return formatDateTime(date, 'onlyDate');
  }
}
