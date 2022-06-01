import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConvertPricePipe } from './convert-price.pipe';
import { GetCoreNamePipe } from './get-core-name.pipe';
import { SpaceToUnderscorePipe } from './space-to-underscore.pipe';
import { ExceptValuePipe } from './except-value.pipe';



@NgModule({
  imports: [CommonModule],
  declarations: [SpaceToUnderscorePipe, GetCoreNamePipe, ConvertPricePipe, ExceptValuePipe],
  exports: [SpaceToUnderscorePipe, GetCoreNamePipe, ConvertPricePipe, ExceptValuePipe]
})
export class PipeModule { }
