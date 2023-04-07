import { Component } from '@angular/core';
import { formatDateTime } from 'src/utils/utils';

interface Attendance {
  date: string;
  employee: StaffAttendance[];
}

interface StaffAttendance {
  name: string;
  checkIn: string;
  checkOut: string;
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
  date = null;

  ngOnInit() {
    let mockDate = formatDateTime(null, 'onlyTime');
    let nextList = [
      {
        date: formatDateTime('2020-04-01', 'onlyDate'),
        employee: [
          {
            name: 'Jessica Lopes1',
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes2',
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
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
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
            checkIn: mockDate,
            checkOut: mockDate,
          },
          {
            name: 'Jessica Lopes4',
            checkIn: mockDate,
            checkOut: mockDate,
          },
        ],
      },
    ];

    this.employeeList = this.getAllNameOfEmployee(nextList);
    this.timeStampList = nextList;
    this.isLoading = false;
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

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
}
