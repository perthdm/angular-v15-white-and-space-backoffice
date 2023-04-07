import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Staff } from 'src/app/model/staff.model';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent {
  dataList: Staff[] | any;
  currentPage: number = 1;
  pageLimit: number = 10;
  isLoading: boolean = true;
  isVisible: boolean = false;

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    this.staffService.getStaff().subscribe(
      (res) => {
        let { info, results } = res;
        let next = [];
        for (let i = 0; i < 10; i++) {
          next.push(...results);
        }
        this.dataList = next;
        this.currentPage = 1;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
