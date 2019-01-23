import { omit } from 'lodash/fp';

import { Step } from '../../models/step.model';

import * as fromWizardActions from '../actions/wizard.action';
import * as fromStepsActions from '../actions/steps.action';

export interface WizardState {
  title: string;
  loading: boolean;
  wizardLoaded: boolean;
  stepEntities: { [id: string]: Step };
  stepOrder: string[];
  currentStepId: string;
  finished: boolean;
  extraModel: {};
}

export const initialState: WizardState = {
  title: null,
  loading: false,
  wizardLoaded: false,
  stepEntities: {},
  stepOrder: [],
  currentStepId: null,
  finished: false,
  extraModel: {}
};

// split up the actions into their own file to keep size down, but since they deal with the same
// slice of state they must all be handled in the same reducer function
export function reducer(
  state = initialState,
  action: fromWizardActions.WizardAction | fromStepsActions.StepsAction
): WizardState {
  switch (action.type) {
    case fromWizardActions.wizardActionTypes.LOAD_WIZARD: {
      const { title } = action.payload;
      return {
        ...state,
        title,
        loading: true
      };
    }

    case fromWizardActions.wizardActionTypes.LOAD_WIZARD_FAIL: {
      return {
        ...state,
        loading: false,
        wizardLoaded: false
      };
    }

    case fromWizardActions.wizardActionTypes.LOAD_WIZARD_SUCCESS: {
      const { steps, extraModel } = action.payload;
      let stepEntities = state.stepEntities;
      const stepOrder = steps.map(step => step.id);
      // if there are other stores that will manually handle entities (most likely not) move this to a utility
      stepEntities = steps.reduce(
        (entities: { [id: number]: Step }, step: Step) => {
          return {
            ...entities,
            [step.id]: step
          };
        },
        {
          ...state.stepEntities
        }
      );
      const currentStepId = stepOrder[0] || null;

      return {
        ...state,
        stepOrder,
        stepEntities,
        loading: false,
        wizardLoaded: true,
        currentStepId,
        extraModel
      };
    }

    case fromWizardActions.wizardActionTypes.NEXT_STEP:
    case fromWizardActions.wizardActionTypes.PREV_STEP:
    case fromWizardActions.wizardActionTypes.FINISH_WIZARD: {
      return {
        ...state,
        loading: true
      };
    }

    case fromWizardActions.wizardActionTypes.NEXT_STEP_FAIL:
    case fromWizardActions.wizardActionTypes.PREV_STEP_FAIL:
    case fromWizardActions.wizardActionTypes.FINISH_WIZARD_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case fromWizardActions.wizardActionTypes.NEXT_STEP_SUCCESS:
    case fromWizardActions.wizardActionTypes.GO_TO_STEP: {
      const { model } = action.payload;
      let currentStepId: string;

      if (
        'stepId' in action.payload &&
        state.stepOrder.includes(action.payload.stepId)
      ) {
        currentStepId = action.payload.stepId;
      } else {
        const currentStepPosition = state.stepOrder.indexOf(
          state.currentStepId
        );
        currentStepId =
          currentStepPosition === state.stepOrder.length - 1
            ? state.currentStepId
            : state.stepOrder[currentStepPosition + 1];
      }

      // only mark a step as visited when it's been completed
      const stepEntities = {
        ...state.stepEntities,
        [state.currentStepId]: {
          ...state.stepEntities[state.currentStepId],
          model,
          isVisisted: true
        }
      };

      return {
        ...state,
        stepEntities,
        currentStepId,
        loading: false
      };
    }

    case fromWizardActions.wizardActionTypes.PREV_STEP_SUCCESS: {
      // should the model be saved here too? even though the step isn't technically visited?
      const currentStepPosition = state.stepOrder.indexOf(state.currentStepId);
      if (currentStepPosition === 0) {
        return state;
      }
      const currentStepId = state.stepOrder[currentStepPosition - 1];

      return {
        ...state,
        currentStepId,
        loading: false
      };
    }

    case fromWizardActions.wizardActionTypes.FINISH_WIZARD_SUCCESS: {
      return {
        ...state,
        loading: false,
        finished: true
      };
    }

    case fromStepsActions.stepsActionTypes.INSERT_STEP: {
      const step = action.payload;

      if (state.stepOrder.includes(step.id)) {
        return state;
      }

      const stepEntities = {
        ...state.stepEntities,
        [step.id]: step
      };
      const stepOrder = [...state.stepOrder, step.id];

      return {
        ...state,
        stepEntities,
        stepOrder
      };
    }

    case fromStepsActions.stepsActionTypes.INSERT_STEP_BEFORE: {
      const { stepToInsert, insertBefore } = action.payload;

      if (state.stepOrder.includes(stepToInsert.id)) {
        return state;
      }

      const stepEntities = {
        ...state.stepEntities,
        [stepToInsert.id]: stepToInsert
      };
      const insertAtIndex = state.stepOrder.indexOf(insertBefore);
      const stepOrder =
        insertAtIndex > -1
          ? [
              ...state.stepOrder.slice(0, insertAtIndex),
              stepToInsert.id,
              ...state.stepOrder.slice(insertAtIndex)
            ]
          : [...state.stepOrder, stepToInsert.id];

      return {
        ...state,
        stepEntities,
        stepOrder
      };
    }

    case fromStepsActions.stepsActionTypes.INSERT_STEP_AFTER: {
      const { stepToInsert, insertAfter } = action.payload;

      if (state.stepOrder.includes(stepToInsert.id)) {
        return state;
      }

      const stepEntities = {
        ...state.stepEntities,
        [stepToInsert.id]: stepToInsert
      };
      const insertAfterIndex = state.stepOrder.indexOf(insertAfter);
      const stepOrder =
        insertAfterIndex > -1
          ? [
              ...state.stepOrder.slice(0, insertAfterIndex + 1),
              stepToInsert.id,
              ...state.stepOrder.slice(insertAfterIndex + 1)
            ]
          : [...state.stepOrder, stepToInsert.id];

      return {
        ...state,
        stepEntities,
        stepOrder
      };
    }

    case fromStepsActions.stepsActionTypes.REMOVE_STEP_ID: {
      const stepId = action.payload;
      if (!state.stepOrder.includes(stepId)) {
        return state;
      }
      const { [stepId]: removedStep, ...stepEntities } = state.stepEntities;
      const stepOrder = state.stepOrder.filter(id => id !== stepId);

      return {
        ...state,
        stepEntities,
        stepOrder
      };
    }

    case fromStepsActions.stepsActionTypes.REMOVE_STEP_FILTER: {
      const filter = action.payload;
      const stepsToRemove = state.stepOrder.filter(stepId => {
        return filter(state.stepEntities[stepId]);
      });
      if (stepsToRemove.length === 0) {
        return state;
      }
      const stepEntities = omit(stepsToRemove, state.stepEntities);
      const stepOrder = state.stepOrder.filter(
        id => !stepsToRemove.includes(id)
      );

      return {
        ...state,
        stepEntities,
        stepOrder
      };
    }

    case fromStepsActions.stepsActionTypes.UPDATE_STEP_MODEL: {
      const { id, model } = action.payload;

      if (!state.stepEntities[id]) {
        return state;
      }

      const stepEntities = {
        ...state.stepEntities,
        [id]: { ...state.stepEntities[id], model }
      };

      return {
        ...state,
        stepEntities
      };
    }

    case fromStepsActions.stepsActionTypes.UPDATE_STEPS_MODEL: {
      const steps = action.payload;

      if (steps.length === 0 || !steps) {
        return state;
      }

      let stepEntities = { ...state.stepEntities };

      steps.forEach(step => {
        const { id, model } = step;

        if (!stepEntities[id]) {
          return;
        }

        stepEntities = {
          ...stepEntities,
          [id]: { ...stepEntities[id], model }
        };
      });

      return { ...state, stepEntities };
    }

    default:
      return state;
  }
}

export const getTitle = (state: WizardState) => state.title;
export const getStepEntities = (state: WizardState) => state.stepEntities;
export const getStepOrder = (state: WizardState) => state.stepOrder;
export const getCurrentStepId = (state: WizardState) => state.currentStepId;
export const getWizardLoaded = (state: WizardState) => state.wizardLoaded;
export const getLoading = (state: WizardState) => state.loading;
export const getFinished = (state: WizardState) => state.finished;
export const getExtraModel = (state: WizardState) => state.extraModel;
