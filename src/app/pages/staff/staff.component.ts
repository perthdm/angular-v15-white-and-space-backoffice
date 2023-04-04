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
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
