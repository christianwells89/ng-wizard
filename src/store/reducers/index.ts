import { ActionReducerMap, createFeatureSelector, Action } from '@ngrx/store';

import * as fromWizard from './wizard.reducer';

export interface WizardState {
  wizard: fromWizard.WizardState;
}

export const reducers: ActionReducerMap<WizardState> = {
  wizard: fromWizard.reducer
};

export const getWizardState = createFeatureSelector<WizardState>('wizard');
