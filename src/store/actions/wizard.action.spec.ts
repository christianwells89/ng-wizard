import { Component } from '@angular/core';
import { EMPTY, of } from 'rxjs';

import * as fromWizard from './wizard.action';
import { TestStep } from './steps.action.spec';

describe('Wizard Actions', () => {
  describe('load wizard actions', () => {
    describe('LoadWizard', () => {
      it('should create an action with a payload', () => {
        const payload = { title: 'Test', load: EMPTY, steps: [] };
        const action = new fromWizard.LoadWizard(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.LOAD_WIZARD,
          payload,
        });
      });
    });

    describe('LoadWizardFail', () => {
      it('should create an action', () => {
        const payload = { message: 'An error' };
        const action = new fromWizard.LoadWizardFail(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.LOAD_WIZARD_FAIL,
          payload,
        });
      });
    });

    describe('LoadWizardSuccess', () => {
      it('should create an action with a payload', () => {
        const payload = { steps: [new TestStep('testStep1', 'Test Step')], title: 'Test Wizard' };
        const action = new fromWizard.LoadWizardSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.LOAD_WIZARD_SUCCESS,
          payload,
        });
      });
    });
  });

  describe('finish wizard actions', () => {
    describe('FinishWizard', () => {
      it('should create an action', () => {
        const payload = { finish: (data: {}) => of(true) };
        const action = new fromWizard.FinishWizard(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.FINISH_WIZARD,
          payload,
        });
      });
    });

    describe('FinishWizardFail', () => {
      it('should create an action', () => {
        const payload = { message: 'An error' };
        const action = new fromWizard.FinishWizardFail(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.FINISH_WIZARD_FAIL,
          payload,
        });
      });
    });

    describe('FinishWizardSuccess', () => {
      it('should create an action without a payload', () => {
        const action = new fromWizard.FinishWizardSuccess();
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.FINISH_WIZARD_SUCCESS,
          payload: undefined,
        });
      });

      it('should create an action with a payload', () => {
        const payload = { message: 'Success' };
        const action = new fromWizard.FinishWizardSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.FINISH_WIZARD_SUCCESS,
          payload,
        });
      });
    });
  });

  describe('next step functions', () => {
    describe('NextStep', () => {
      it('should create an action with a payload', () => {
        const payload = {
          model: {},
          formValid: true,
          modelValid: true,
          onNext: EMPTY,
        };
        const action = new fromWizard.NextStep(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.NEXT_STEP,
          payload,
        });
      });
    });

    describe('NextStepFail', () => {
      it('should create an action', () => {
        const payload = { message: 'An error' };
        const action = new fromWizard.NextStepFail(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.NEXT_STEP_FAIL,
          payload,
        });
      });
    });

    describe('NextStepSuccess', () => {
      it('should create an action', () => {
        const payload = { model: {} };
        const action = new fromWizard.NextStepSuccess(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.NEXT_STEP_SUCCESS,
          payload,
        });
      });
    });

    describe('GoToStep', () => {
      it('should create an action', () => {
        const payload = { stepId: 'name', model: {} };
        const action = new fromWizard.GoToStep(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.GO_TO_STEP,
          payload,
        });
      });
    });
  });

  describe('previous step actions', () => {
    describe('PreviousStep', () => {
      it('should create an action', () => {
        const action = new fromWizard.PreviousStep();
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.PREV_STEP,
        });
      });
    });

    describe('PreviousStepFail', () => {
      it('should create an action', () => {
        const payload = { message: 'An error' };
        const action = new fromWizard.PreviousStepFail(payload);
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.PREV_STEP_FAIL,
          payload,
        });
      });
    });

    describe('PreviousStepSuccess', () => {
      it('should create an action', () => {
        const action = new fromWizard.PreviousStepSuccess();
        expect({ ...action }).toEqual({
          type: fromWizard.wizardActionTypes.PREV_STEP_SUCCESS,
        });
      });
    });
  });
});
