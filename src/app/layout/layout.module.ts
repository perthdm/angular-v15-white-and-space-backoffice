import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';

// === COMPONENT BINDING WITH MODULE === //
// === BINDING FOR USE ANOTHER MODULE === //
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { SidebarWrapperComponent } from './sidebar-wrapper/sidebar-wrapper.component';

@NgModule({
  declarations: [LayoutComponent, DashboardComponent, SidebarWrapperComponent],
  imports: [
    LayoutRoutingModule,
    IconsProviderModule,
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
  ],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
