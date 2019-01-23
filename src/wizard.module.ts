import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { reducers, effects } from './store';

import * as fromContainers from './containers';

import * as fromComponents from './components';

import * as fromDirectives from './directives';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forRoot([]),
    EffectsModule.forFeature(effects),
    FontAwesomeModule,
    FormsModule,
    StoreModule.forRoot({}, { metaReducers: [] }),
    StoreModule.forFeature('wizard', reducers),
  ],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromDirectives.directives,
  ],
  exports: [...fromContainers.containers],
})
export class WizardModule {}
