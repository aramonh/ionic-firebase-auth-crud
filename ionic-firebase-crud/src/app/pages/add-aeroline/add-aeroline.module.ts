import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAerolinePageRoutingModule } from './add-aeroline-routing.module';

import { AddAerolinePage } from './add-aeroline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAerolinePageRoutingModule
  ],
  declarations: [AddAerolinePage]
})
export class AddAerolinePageModule {}
