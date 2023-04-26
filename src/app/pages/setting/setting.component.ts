import { Component } from '@angular/core';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CafeService } from 'src/app/services/cafe.service';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  cafeData: any = {};
  switchValue = false;
  constructor(
    private cafeService: CafeService,
    private message: NzMessageService
  ) {}

  resetData = () => {
    this.cafeData = {};
  };

  handleOk(): void {
    let reqData = {
      id: this.cafeData._id,
      name: this.cafeData.name,
      description: this.cafeData.description,
      telephone: this.cafeData.telephone,
      location: this.cafeData.location,
      status: this.cafeData.status,
      product_min_amount: Number(this.cafeData.product_min_amount),
    };
    this.cafeService.updateCafe(reqData).subscribe(
      (res) => {
        this.resetData();
        this.message.create('success', `แก้ไขสินค้าสำเร็จ`);
      },
      (err) => {
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        );  
      }
    );
  }

  onChangeData(e: any) {
    let { name, value } = e.target;
    this.cafeData = {
      ...this.cafeData,
      [name]: value,
    };
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} file upload failed.`);
    }
  }
}
