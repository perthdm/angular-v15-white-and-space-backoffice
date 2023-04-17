import { Component } from '@angular/core';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent {
  dataList: Employee[] | any;

  isLoading: boolean = true;
  isVisible: boolean = false;

  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  total: number = 0;

  employeeData = {} as Employee;
  message: any;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchEmployee();
  }

  fetchEmployee() {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
      query: this.query,
    };

    this.employeeService.getAllEmployee(pageConfig).subscribe(
      (res) => {
        let { total, page, last_page, items } = res;
        items.map((us: Employee) => {
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

  onChangeData(e: any) {
    let { name, value } = e.target;
    if (name === 'salary') value = +value;
    this.employeeData = {
      ...this.employeeData,
      [name]: value,
    };
  }

  editEmployee(current: any) {
    this.employeeData = current;
    this.isVisible = true;
  }

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchEmployee();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.employeeService.addEmployee(this.employeeData).subscribe(
      (res) => {
        // console.log(res);
        console.log(res);
        this.fetchEmployee();
        this.message.create('success', `เพิ่มผู้ใช้ข้อมูลพนักงานสำเร็จ`);
      },
      (err) =>
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        )
    );
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
