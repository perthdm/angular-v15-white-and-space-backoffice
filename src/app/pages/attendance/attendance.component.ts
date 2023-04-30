import { Component } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime, getStorage } from 'src/utils/utils';
import Swal from 'sweetalert2';

interface Attendance {
  date: string;
  items: StaffAttendance[];
}

interface StaffAttendance {
  user: { _id: string; name: string; username: string };
  type: string;
  check_in: string;
  check_out: string | any;
  worked_time: number;
}

interface IManDay {
  nHours: any;
  otHours: any;
  nPerHours: any;
  otPerHours: any;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  checkInList: Attendance[] | any = [];
  employeeList: string[] = [];
  selectedValue = null;
  isLoading: boolean = true;
  isVisible: boolean = false;
  currentData: any = {};
  isAccess: boolean =
    getStorage('role') === 'owner' || getStorage('role') === 'manager';

  manDayData: IManDay = {
    nHours: null,
    otHours: null,
    nPerHours: null,
    otPerHours: null,
  };

  dateRange: any = [
    moment().startOf('week').toDate(),
    moment().endOf('week').toDate(),
  ];
  dateFormat = 'dd-MM-YYYY';

  constructor(
    private userService: UserService,
    private usService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchCheckInHistory();
  }

  fetchCheckInHistory() {
    let reqConfig: any = {
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };

    this.userService.getCheckInHistory(reqConfig).subscribe(
      (res) => {
        let { items } = res;

        if (this.isAccess) {
          this.checkInList = items;
          this.employeeList = this.getAllNameOfEmployee(items);
        } else {
          this.checkInList.items = items;
        }

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

  getAllNameOfEmployee(list: any): any {
    let temp: any = [];

    list.map((current: any) => {
      let { items } = current;
      items.map((em: any) => {
        if (!temp.includes(em.user.name)) {
          temp.push(em.user.name);
        }
      });
    });
    return temp;
  }

  onChangeData(event: any) {
    let { name, value } = event.target;
    value = value.replace(/\D|\+|-/g, '');

    this.manDayData = {
      ...this.manDayData,
      [name]: +value,
    };
  }

  handleClose() {
    this.isVisible = false;
    this.resetData();
  }

  resetData() {
    this.manDayData = {
      nHours: null,
      otHours: null,
      nPerHours: null,
      otPerHours: null,
    };
    this.currentData = {};
  }

  handleSubmitData(): any {
    let usedHours = +this.manDayData.nHours + +this.manDayData.otHours;
    let totalHours = +this.currentData.worked_time.toFixed(0);
    console.log('SUM ==>', usedHours);
    console.log('HAVE : ', totalHours);

    if (usedHours !== totalHours) {
      return this.message.create(
        'error',
        `กรุณาจัดสรรชั่วโมงการทำงานให้ครบ ${this.currentData.worked_time.toFixed(
          0
        )} ชั่วโมง`
      );
    }

    let reqData = {
      id: this.currentData.user._id,
      normal_hours: this.manDayData.nHours,
      normal_per_hours: this.manDayData.nPerHours,
      ot_hours: this.manDayData.otPerHours,
      ot_per_hours: this.manDayData.otPerHours,
    };

    this.userService.setManDayHours(reqData).subscribe(
      (res) => {
        this.message.create('success', `การตั้งรายได้สำหรับพนักงานสำเร็จ`);
        this.fetchCheckInHistory();
        this.handleClose();
      },
      (err) => {
        this.message.create(
          'error',
          `กรุณาลองอีกครั้ง *ชั่วโมงในการทำงานจะต้องมีมากกว่า 0 ชั่วโมง*`
        );
      }
    );
  }

  handleManageHours(rowData: StaffAttendance) {
    let totalHours: any = rowData.worked_time.toFixed(0);

    if (totalHours > 0) {
      this.currentData = rowData;
      this.isVisible = true;
    } else {
      this.message.create(
        'error',
        `กรุณาลองอีกครั้ง *ชั่วโมงในการทำงานจะต้องมีมากกว่า 0 ชั่วโมง*`
      );
    }
  }

  handleCheckOut(userId: string) {
    Swal.fire({
      title: 'คำเตือน!',
      text: 'คุณต้องการที่จะ Check Out การทำงานในวันนี้ใช่หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันออเดอร์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value && userId) {
        this.usService.employeeAttendance(userId).subscribe(
          () => {
            this.message.create('success', `คุณได้ทำการ Check Out สำเร็จ`);
            this.fetchCheckInHistory();
          },
          (err) => {
            this.message.create(
              'error',
              `Please try again ${err.error.message}::${err.error.statusCode}`
            );
          }
        );
      }
    });
  }

  mapDate(date: string, option?: string) {
    return formatDateTime(date, option);
  }
}
