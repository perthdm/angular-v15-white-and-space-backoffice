import { Component } from '@angular/core';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent {
  isShowModal: boolean = false;
  selectedValue = null;
  value?: string;
  inputValue?: string;

  showModal(): void {
    this.isShowModal = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isShowModal = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isShowModal = false;
  }

  
}
