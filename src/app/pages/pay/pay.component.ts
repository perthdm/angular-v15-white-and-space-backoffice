import { Component, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent {
  @ViewChild('htmlData') htmlData!: ElementRef;

  userList: IUser | any = [];
  dataList: any = [];
  isShowModal: boolean = false;
  userSelected = null;
  value?: string;

  netMoney?: string;
  size = 'default';

  fileName = 'Data.xlsx';

  mainDateRange: any = [
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ];
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

  isVisible = false;

  constructor(
    private usService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchPayCycle();
  }

  fetchPayCycle(type?: string) {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
      query: this.query,
    };

    if (type) {
      pageConfig.page = 1;
      pageConfig.limit = 100;
    }

    this.usService.getPayCycle(pageConfig).subscribe((res) => {
      let { items, total } = res;
      this.dataList = items;
      this.total = total;
    });
  }

  handleChangeDate() {
    this.page = 1;
    this.fetchPayCycle();
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

  exportPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Data.pdf');
    });
  }

  showModalPDF(): void {
    this.fetchPayCycle('PDF');
    this.isVisible = true;
  }
  handleOk(): void {
    this.exportPDF();
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
