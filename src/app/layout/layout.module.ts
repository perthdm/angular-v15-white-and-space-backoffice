import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

// === COMPONENT BINDING WITH MODULE === //
// === BINDING FOR USE ANOTHER MODULE === //
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { SidebarWrapperComponent } from './sidebar-wrapper/sidebar-wrapper.component';
import { StaffComponent } from '../pages/staff/staff.component';
import { ShopComponent } from '../pages/shop/shop.component';
import { PermissionComponent } from '../pages/permission/permission.component';
import { SharedModule } from '../shared/shared.module';

import { StaffService } from '../services/staff.service';
import { AntdSearchBox } from '../shared/components/searchbox/antd-searchbox.component';
import { ReportComponent } from '../pages/report/report.component';
import { TimeStampComponent } from '../pages/time-stamp/time-stamp.component';
import { BillingHistoryComponent } from '../pages/billing-history/billing-history.component';

@NgModule({
  imports: [
    LayoutRoutingModule,
    NzLayoutModule,
    IconsProviderModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
    SidebarWrapperComponent,
    ShopComponent,
    DashboardComponent,
    StaffComponent,
    PermissionComponent,
    ReportComponent,
    TimeStampComponent,
    BillingHistoryComponent,
    AntdSearchBox,
  ],

  providers: [StaffService],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
