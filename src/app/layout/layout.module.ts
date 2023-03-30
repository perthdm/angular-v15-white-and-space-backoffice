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

@NgModule({
  declarations: [LayoutComponent, DashboardComponent, SidebarWrapperComponent],
  imports: [
    LayoutRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    SharedModule,
  ],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
