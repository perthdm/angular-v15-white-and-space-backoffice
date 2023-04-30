import { Component } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';
import Swal from 'sweetalert2';

interface Attendance {
  date: string;
  items: StaffAttendance[];
}

interface StaffAttendance {
  user: { name: string };
  type: string;
  check_in: string;
  check_out: string | any;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  checkInList: Attendance[] = [];
  employeeList: string[] = [];
  isLoading: boolean = true;
  selectedValue = null;

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
        console.log(res);
        let { items } = res;
        this.checkInList = items;
        this.employeeList = this.getAllNameOfEmployee(items);
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
    console.log(list);

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

  handleCheckOut() {
    Swal.fire({
      title: 'คำเตือน!',
      text: 'คุณต้องการที่จะ Check Out การทำงานในวันนี้ใช่หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันออเดอร์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.usService.employeeAttendance('checkOut').subscribe(
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

        // this.message.create(
        //   'error',
        //   `Please try again ${err.error.message}::${err.error.statusCode}`
        // );
      }
    });
  }

  mapDate(date: string, option?: string) {
    return formatDateTime(date, option);
  }
}
