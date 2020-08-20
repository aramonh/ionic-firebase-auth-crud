import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAerolinePage } from './add-aeroline.page';

const routes: Routes = [
  {
    path: '',
    component: AddAerolinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAerolinePageRoutingModule {}
