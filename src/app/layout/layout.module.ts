import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

// === COMPONENT BINDING WITH MODULE === //
// === BINDING FOR USE ANOTHER MODULE === //
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { SidebarWrapperComponent } from './sidebar-wrapper/sidebar-wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { StaffComponent } from '../pages/staff/staff.component';
import { ShopComponent } from '../pages/shop/shop.component';
import { StaffService } from '../services/staff.service';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarWrapperComponent,
    DashboardComponent,
    StaffComponent,
    ShopComponent,
  ],
  imports: [
    LayoutRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    SharedModule,
  ],
  providers: [StaffService],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
