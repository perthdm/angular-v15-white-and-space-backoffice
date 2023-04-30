import { Component } from '@angular/core';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { formatDateTime } from 'src/utils/utils';

interface Attendance {
  date: string;
  employee: StaffAttendance[];
}

interface StaffAttendance {
  name: string;
  type: string;
  checkIn: string;
  checkOut: string | any;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  timeStampList: Attendance[] = [];
  employeeList: string[] = [];
  isLoading: boolean = true;
  selectedValue = null;

  dateRange: any = [
    moment().startOf('week').toDate(),
    moment().endOf('week').toDate(),
  ];
  dateFormat = 'dd-MM-YYYY';

  constructor(private userService: UserService) {}

  ngOnInit() {
    let mockDate = formatDateTime(null, 'onlyTime');
    this.fetchCheckInHistory();
    let nextList = [
      {
        date: formatDateTime('2020-04-01', 'onlyDate'),
        employee: [
          {
            name: 'Jessica Lopes1',
            type: 'full-time',
            checkIn: mockDate,
            checkOut: mockDate,
            totalHours: 0,
            nHours: 0,
            otHours: 0,
          },
          {
            name: 'Jessica Lopes2',
            type: 'full-time',
            checkIn: mockDate,
            checkOut: mockDate,
          },
        ],
      },
      {
        date: formatDateTime('2020-04-02', 'onlyDate'),
        employee: [
          {
            name: 'Jessica Lopes3',
            type: 'part-time',
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
            type: 'full-time',
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
            type: 'full-time',
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
            type: 'full-time',
            checkIn: mockDate,
            checkOut: mockDate,
          },
        ],
      },
      {
        date: formatDateTime('2020-04-03', 'onlyDate'),
        employee: [
          {
            name: 'Jessica Lopes3',
            type: 'part-time',
            checkIn: mockDate,
            checkOut: null,
          },
          {
            name: 'Jessica Lopes4',
            type: 'full-time',
            checkIn: mockDate,
            checkOut: null,
          },
        ],
      },
    ];

    this.employeeList = this.getAllNameOfEmployee(nextList);
    this.timeStampList = nextList;
    this.isLoading = false;
  }

  fetchCheckInHistory() {
    let reqConfig: any = {
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };

    this.userService.getCheckInHistory(reqConfig).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {}
    );
  }

  getAllNameOfEmployee(list: any): any {
    let temp: any = [];
    list.map((item: any) => {
      let { employee } = item;
      employee.map((em: any) => {
        if (!temp.includes(em.name)) {
          temp.push(em.name);
        }
      });
    });
    return temp;
  }

  handleCheckOut(current: any) {
    current.checkOut = formatDateTime(null, 'onlyTime');
  }
}
