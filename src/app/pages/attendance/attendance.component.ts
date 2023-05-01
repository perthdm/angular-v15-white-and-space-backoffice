import { Component } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime, getStorage, getDefaultValue } from 'src/utils/utils';
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

        this.checkInList = items;
        this.employeeList = this.isAccess
          ? this.getAllNameOfEmployee(items)
          : [];

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

    this.currentData = {
      ...this.currentData,
      [name]: +value,
    };
  }

  handleClose() {
    this.isVisible = false;
    this.resetData();
  }

  resetData() {
    this.currentData = {};
  }

  handleSubmitData(): any {
    let usedHours = +this.currentData.nHours + +this.currentData.otHours;
    let totalHours = +this.currentData.worked_time.toFixed(0);
    // console.log('SUM ==>', usedHours);
    // console.log('HAVE : ', totalHours);

    if (usedHours != totalHours) {
      return this.message.create(
        'error',
        `กรุณาจัดสรรชั่วโมงการทำงานให้ครบ ${this.currentData.worked_time.toFixed(
          0
        )} ชั่วโมง`
      );
    }

    let reqData = {
      id: this.currentData._id,
      normal_hours: this.currentData.nHours,
      normal_per_hours: this.currentData.nPerHours,
      ot_hours: this.currentData.otHours,
      ot_per_hours: this.currentData.otPerHours,
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
          `Please try again ${err.error.message}::${err.error.statusCode}`
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

  handleCheckOut(userId: string, attendanceId?: string) {
    Swal.fire({
      title: 'คำเตือน!',
      text: 'คุณต้องการที่จะ Check Out การทำงานในวันนี้ใช่หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันออเดอร์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value && userId) {
        this.usService.checkOut(userId, attendanceId).subscribe(
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

  checkManaged(em: any): boolean {
    if (this.isAccess) {
      if (em.check_out) {
        if (em.check_out && em?.worked_time?.toFixed(0) == 0) {
          return false;
        } else {
          return em.pay ? false : true;
        }
      } else {
        return false;
      }
    }

    return false;
  }
}
