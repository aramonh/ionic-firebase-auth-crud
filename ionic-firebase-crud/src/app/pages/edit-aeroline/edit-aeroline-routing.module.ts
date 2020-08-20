import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAerolinePage } from './edit-aeroline.page';

const routes: Routes = [
  {
    path: '',
    component: EditAerolinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAerolinePageRoutingModule {}
