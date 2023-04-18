import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { formatDateTime } from 'src/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent {
  dataList: Employee[] | any;

  isLoading: boolean = true;
  isVisible: boolean = false;
  isEdit: boolean = false;

  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  total: number = 0;

  employeeData = {} as any;

  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService
  ) {}

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
    if (name === 'telephone') {
      value = value.replace(/\D|\+|-/g, '');
    }

    if (name === 'salary') value = +value;

    this.employeeData = {
      ...this.employeeData,
      [name]: value,
    };
  }

  editEmployee(current: any) {
    this.employeeData = current;
    this.isVisible = true;
    this.isEdit = true;
  }

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchEmployee();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (!this.isEdit) {
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
            `เกิดข้อผิดพลาด ${err.error.message}::${err.error.statusCode}`
          )
      );
    } else {
      let { _id, name, salary, telephone } = this.employeeData;
      let reqData = { id: _id, name, salary, telephone };
      this.employeeService.updeteEmployee(reqData).subscribe(
        () => {
          this.message.create(
            'success',
            `แก้ไขข้อมูลผู้ใช้งาน "${this.employeeData.name}" สำเร็จ`
          );
          this.fetchEmployee();
        },
        (err) => {
          this.message.create(
            'error',
            `เกิดข้อผิดพลาด ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.employeeData = {  };
    this.isVisible = false;
  }

  handleDeleteEmployee(event: any, employeeData: Employee) {
    event.stopPropagation();
    Swal.fire({
      title: 'คำเตือน !',
      text: `คุณต้องการที่จะลบข้อมูลของ "${employeeData?.name}" ใช่หรือไม่ ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.employeeService.deleteEmployee(employeeData._id).subscribe(
          () => {
            this.message.create(
              'success',
              `ลบข้อมูลพนักงาน "${employeeData.name}" สำเร็จ`
            );
            this.fetchEmployee();
          },
          (err) => {
            this.message.create(
              'error',
              `เกิดข้อผิดพลาด ${err.error.message}::${err.error.statusCode}`
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  }
}
