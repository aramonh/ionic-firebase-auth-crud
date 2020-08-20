import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAerolinePageRoutingModule } from './edit-aeroline-routing.module';

import { EditAerolinePage } from './edit-aeroline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAerolinePageRoutingModule
  ],
  declarations: [EditAerolinePage]
})
export class EditAerolinePageModule {}
