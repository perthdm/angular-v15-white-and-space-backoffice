import { Component, Input } from '@angular/core';

@Component({
  selector: 'antd-searchbox',
  template: ` <nz-input-group
      [nzSuffix]="suffixIconSearch"
      class="searchbar-style"
    >
      <input type="text" nz-input [placeholder]="placeholder" />
    </nz-input-group>
    <ng-template #suffixIconSearch>
      <span nz-icon nzType="search"></span>
    </ng-template>`,
  styleUrls: ['./antd-search.scss'],
})
export class AntdSearchBox {
  @Input() placeholder?: string;
}
