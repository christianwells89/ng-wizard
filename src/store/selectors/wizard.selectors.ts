import { createSelector } from '@ngrx/store';

import { concat, mergeWith } from 'lodash';

import * as fromFeature from '../reducers';
import * as fromWizard from '../reducers/wizard.reducer';

export const getFullWizardState = createSelector(
  fromFeature.getWizardState,
  state => state.wizard
);

export const getTitle = createSelector(
  getFullWizardState,
  fromWizard.getTitle
);

export const getStepEntities = createSelector(
  getFullWizardState,
  fromWizard.getStepEntities
);

export const getStepOrder = createSelector(
  getFullWizardState,
  fromWizard.getStepOrder
);

export const getStepCount = createSelector(
  getStepOrder,
  stepOrder => stepOrder.length
);

export const getCurrentStepId = createSelector(
  getFullWizardState,
  fromWizard.getCurrentStepId
);

export const getCurrentStep = createSelector(
  getCurrentStepId,
  getStepEntities,
  (currentStepId, stepEntities) => {
    return stepEntities[currentStepId] || null;
  }
);

export const getCurrentStepModel = createSelector(
  getCurrentStep,
  currentStep => currentStep.model
);

export const getCurrentStepNumber = createSelector(
  getCurrentStepId,
  getStepOrder,
  (currentStepId, stepOrder) => stepOrder.indexOf(currentStepId) + 1
);

export const getCurrentStepTitle = createSelector(
  getCurrentStep,
  currentStep => currentStep && currentStep.title
);

export const getWizardLoaded = createSelector(
  getFullWizardState,
  fromWizard.getWizardLoaded
);

export const getLoading = createSelector(
  getFullWizardState,
  fromWizard.getLoading
);

export const getExtraModel = createSelector(
  getFullWizardState,
  fromWizard.getExtraModel
);

export const isWizardLoading = createSelector(
  getWizardLoaded,
  getLoading,
  (wizardLoaded, loading) => !wizardLoaded && loading
);

export const isStepLoading = createSelector(
  getWizardLoaded,
  getLoading,
  (wizardLoaded, loading) => wizardLoaded && loading
);

export const isWizardFinished = createSelector(
  getFullWizardState,
  fromWizard.getFinished
);

export const isLastStep = createSelector(
  getCurrentStepNumber,
  getStepCount,
  (stepNumber, stepCount) => stepNumber === stepCount
);

export const getCollatedModel = createSelector(
  getStepOrder,
  getStepEntities,
  getExtraModel,
  (stepOrder, entities, extraModel) => {
    let data: any = extraModel; // should always at least be an empty object

    stepOrder.forEach(stepId => {
      const step = entities[stepId];
      if (!step.isVisisted) {
        return;
      }

      if (step.alias && step.alias !== '') {
        if (step.asArray) {
          const modelArray = concat(data[step.alias] || [], step.model);
          data = { ...data, [step.alias]: modelArray };
        } else if (step.merge) {
          const currentAliasData = data[step.alias] || {};
          // merge objects, except when a property is undefined
          const newAliasData = mergeWith(currentAliasData, step.model, (a, b) =>
            b === null ? a : undefined
          );
          data = { ...data, [step.alias]: newAliasData };
        } else {
          data = { ...data, [step.alias]: step.model };
        }
      } else {
        data = { ...data, ...step.model };
      }
    });

    return data;
  }
);
