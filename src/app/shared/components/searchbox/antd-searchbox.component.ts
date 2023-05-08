import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'antd-searchbox',
  template: `<nz-input-group
      [nzSuffix]="suffixIconSearch"
      class="searchbar-style"
    >
      <input
        type="text"
        nz-input
        [placeholder]="placeholder"
        [(ngModel)]="searchText"
        (keydown.enter)="onSearch()"
      />
    </nz-input-group>
    <ng-template #suffixIconSearch>
      <span nz-icon nzType="search"></span>
    </ng-template>`,
  styleUrls: ['./antd-searchbox.component.scss'],
})
export class AntdSearchBox {
  @Input() placeholder: string = 'ค้นหารายการ';
  @Output() onSearchEvent: EventEmitter<string> = new EventEmitter<string>();
  searchText: string = '';

  constructor() {}

  onSearch() {
    this.onSearchEvent.emit(this.searchText);
  }
}
