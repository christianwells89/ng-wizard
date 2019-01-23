import { Action } from '@ngrx/store';

import { Step } from '../../models/step.model';

export enum stepsActionTypes {
  // TODO ideally these would have the name of the current wizard rather than [Wizard]
  INSERT_STEP = '[Wizard] Insert Step',
  INSERT_STEP_BEFORE = '[Wizard] Insert Step Before',
  INSERT_STEP_AFTER = '[Wizard] Insert Step After',
  INSERT_STEPS = '[Wizard] Insert Steps',
  INSERT_STEPS_BEFORE = '[Wizard] Insert Steps Before',
  INSERT_STEPS_AFTER = '[Wizard] Insert Steps After',
  REMOVE_STEP_ID = '[Wizard] Remove Step by ID',
  REMOVE_STEP_FILTER = '[Wizard] Remove Steps by Filter',
  UPDATE_STEP_MODEL = '[Wizard] Update Step Model',
  UPDATE_STEPS_MODEL = '[Wizard] Update Steps Model'
}

export class InsertStep implements Action {
  readonly type = stepsActionTypes.INSERT_STEP;
  constructor(public payload: Step) {}
}

export class InsertStepBefore implements Action {
  readonly type = stepsActionTypes.INSERT_STEP_BEFORE;
  constructor(public payload: { stepToInsert: Step; insertBefore: string }) {}
}

export class InsertStepAfter implements Action {
  readonly type = stepsActionTypes.INSERT_STEP_AFTER;
  constructor(public payload: { stepToInsert: Step; insertAfter: string }) {}
}

export class InsertSteps implements Action {
  readonly type = stepsActionTypes.INSERT_STEPS;
  constructor(public payload: Step[]) {}
}

export class InsertStepsBefore implements Action {
  readonly type = stepsActionTypes.INSERT_STEPS_BEFORE;
  constructor(
    public payload: { stepsToInsert: Step[]; insertBefore: string } // steps must be in correct order!
  ) {}
}

export class InsertStepsAfter implements Action {
  readonly type = stepsActionTypes.INSERT_STEPS_AFTER;
  constructor(
    public payload: { stepsToInsert: Step[]; insertAfter: string } // steps must be in correct order!
  ) {}
}

export class RemoveStepById implements Action {
  readonly type = stepsActionTypes.REMOVE_STEP_ID;
  constructor(public payload: string) {}
}

export class RemoveStepByFilter implements Action {
  readonly type = stepsActionTypes.REMOVE_STEP_FILTER;
  constructor(public payload: (step: Step) => boolean) {}
}

export class UpdateStepModel implements Action {
  readonly type = stepsActionTypes.UPDATE_STEP_MODEL;
  constructor(public payload: { id: string; model: {} }) {}
}

export class UpdateStepsModel implements Action {
  readonly type = stepsActionTypes.UPDATE_STEPS_MODEL;
  constructor(public payload: { id: string; model: {} }[]) {}
}

export type StepsAction =
  | InsertStep
  | InsertStepBefore
  | InsertStepAfter
  | InsertSteps
  | InsertStepsBefore
  | InsertStepsAfter
  | RemoveStepById
  | RemoveStepByFilter
  | UpdateStepModel
  | UpdateStepsModel;
