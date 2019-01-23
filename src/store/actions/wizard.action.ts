import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Step } from '../../models/step.model';

export enum wizardActionTypes {
  // TODO ideally these would have the name of the current wizard (module that imported the wizard module?) rather than [Wizard]
  LOAD_WIZARD = '[Wizard] Load Wizard',
  LOAD_WIZARD_FAIL = '[Wizard] Load Wizard Fail',
  LOAD_WIZARD_SUCCESS = '[Wizard] Load Wizard Success',
  FINISH_WIZARD = '[Wizard] Finish Wizard',
  FINISH_WIZARD_FAIL = '[Wizard] Finish Wizard Fail',
  FINISH_WIZARD_SUCCESS = '[Wizard] Finish Wizard Success',
  NEXT_STEP = '[Wizard] Next Step',
  NEXT_STEP_FAIL = '[Wizard] Next Step Fail',
  NEXT_STEP_SUCCESS = '[Wizard] Next Step Success',
  PREV_STEP = '[Wizard] Previous Step',
  PREV_STEP_FAIL = '[Wizard] Previous Step Fail',
  PREV_STEP_SUCCESS = '[Wizard] Previous Step Success',
  GO_TO_STEP = '[Wizard] Go To Step',
  SET_MAX_STEPS = '[Wizard] Set Max Steps' // Not convinced this was ever used in JS version. Leaving action here for prosperity, and if it is ever figured out it is needed
}

export class LoadWizard implements Action {
  readonly type = wizardActionTypes.LOAD_WIZARD;
  constructor(
    public payload: {
      title: string;
      load?: Observable<Step[] | void>;
      steps?: Step[];
      extraModel?: {};
    }
  ) {}
}

export class LoadWizardFail implements Action {
  readonly type = wizardActionTypes.LOAD_WIZARD_FAIL;
  constructor(public payload: any) {}
}

export class LoadWizardSuccess implements Action {
  readonly type = wizardActionTypes.LOAD_WIZARD_SUCCESS;
  constructor(public payload: { steps: Step[]; extraModel: {} }) {}
}

export class FinishWizard implements Action {
  readonly type = wizardActionTypes.FINISH_WIZARD;
  constructor(public payload: { collatedModel: {} }) {}
}

export class FinishWizardFail implements Action {
  readonly type = wizardActionTypes.FINISH_WIZARD_FAIL;
  constructor(public payload: any) {}
}

export class FinishWizardSuccess implements Action {
  readonly type = wizardActionTypes.FINISH_WIZARD_SUCCESS;
  public payload: {
    message: string;
    closeWindow: boolean;
    redirectUrl?: string;
  };
  constructor(
    closeWindow = true,
    redirectUrl?: string,
    message = 'Wizard Complete'
  ) {
    this.payload = { message, closeWindow, redirectUrl };
  }
}

export class NextStep implements Action {
  readonly type = wizardActionTypes.NEXT_STEP;
  constructor(
    public payload: {
      model: Object;
      formValid: boolean;
      modelValid: boolean | string;
      /**
       * An observable that an effect will call. Can return name of next step, which will cause GO_TO_STEP to be dispatched
       */
      onNext?: Observable<any>;
    }
  ) {}
}

export class NextStepFail implements Action {
  readonly type = wizardActionTypes.NEXT_STEP_FAIL;
  constructor(public payload: any) {}
}

export class NextStepSuccess implements Action {
  readonly type = wizardActionTypes.NEXT_STEP_SUCCESS;
  constructor(public payload: { model: Object }) {}
}

export class PreviousStep implements Action {
  readonly type = wizardActionTypes.PREV_STEP;
}

export class PreviousStepFail implements Action {
  readonly type = wizardActionTypes.PREV_STEP_FAIL;
  constructor(public payload: any) {}
}

export class PreviousStepSuccess implements Action {
  readonly type = wizardActionTypes.PREV_STEP_SUCCESS;
}

export class GoToStep implements Action {
  readonly type = wizardActionTypes.GO_TO_STEP;
  constructor(public payload: { stepId: string; model: Object }) {} // basically an alternative to NEXT_STEP_SUCCESS, so pass in current step's model so it can be saved
}

// Not convinced this was ever used in JS version. Leaving action here for prosperity, and if it is ever figured out it is needed
export class SetMaxSteps implements Action {
  readonly type = wizardActionTypes.SET_MAX_STEPS;
  constructor(public payload: number) {}
}

// action types
export type WizardAction =
  | LoadWizard
  | LoadWizardFail
  | LoadWizardSuccess
  | FinishWizard
  | FinishWizardFail
  | FinishWizardSuccess
  | NextStep
  | NextStepFail
  | NextStepSuccess
  | PreviousStep
  | PreviousStepFail
  | PreviousStepSuccess
  | GoToStep
  | SetMaxSteps;
