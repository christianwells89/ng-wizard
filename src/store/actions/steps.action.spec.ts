import { Type } from '@angular/core';

import * as fromSteps from './steps.action';
import { Step } from '../../models/step.model';

export class TestStep extends Step {
  public path = '/testStep';
  public model: {};
  public component: Type<any>;
  constructor(public id: string, public title: string) {
    super();
  }
}

describe('Steps Actions', () => {
  describe('single step insert actions', () => {
    const testStep = new TestStep('testStep1', 'Test Step');

    describe('InsertStep', () => {
      it('should create an action', () => {
        const payload = testStep;
        const action = new fromSteps.InsertStep(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.INSERT_STEP,
          payload,
        });
      });
    });

    describe('InsertStepBefore', () => {
      it('should create an action', () => {
        const payload = {
          stepToInsert: testStep,
          insertBefore: 'testStep2',
        };
        const action = new fromSteps.InsertStepBefore(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.INSERT_STEP_BEFORE,
          payload,
        });
      });
    });

    describe('InsertStepAfter', () => {
      it('should create an action', () => {
        const payload = {
          stepToInsert: testStep,
          insertAfter: 'testStep0',
        };
        const action = new fromSteps.InsertStepAfter(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.INSERT_STEP_AFTER,
          payload,
        });
      });
    });
  });

  describe('multiple step insert actions', () => {
    const testSteps = [
      new TestStep('testStep1', 'Test Step 1'),
      new TestStep('testStep2', 'Test Step 2'),
      new TestStep('testStep3', 'Test Step 3'),
    ];

    describe('InsertSteps', () => {
      it('should create an action', () => {
        const payload = testSteps;
        const action = new fromSteps.InsertSteps(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.INSERT_STEPS,
          payload,
        });
      });
    });

    describe('InsertStepsBefore', () => {
      it('should create an action', () => {
        const payload = {
          stepsToInsert: testSteps,
          insertBefore: 'testStep0',
        };
        const action = new fromSteps.InsertStepsBefore(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.INSERT_STEPS_BEFORE,
          payload,
        });
      });
    });

    describe('InsertStepsAfter', () => {
      it('should create an action', () => {
        const payload = {
          stepsToInsert: testSteps,
          insertAfter: 'testStep0',
        };
        const action = new fromSteps.InsertStepsAfter(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.INSERT_STEPS_AFTER,
          payload,
        });
      });
    });
  });

  describe('step removal actions', () => {
    describe('RemoveStepById', () => {
      it('should create an action', () => {
        const payload = '1';
        const action = new fromSteps.RemoveStepById(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.REMOVE_STEP_ID,
          payload,
        });
      });
    });

    describe('RemoveStepById', () => {
      it('should create an action', () => {
        const payload = (step: Step) => true;
        const action = new fromSteps.RemoveStepByFilter(payload);
        expect({ ...action }).toEqual({
          type: fromSteps.stepsActionTypes.REMOVE_STEP_FILTER,
          payload,
        });
      });
    });
  });
});
