import * as fromWizard from './wizard.reducer';
import * as fromActions from '../actions';

import { TestStep } from '../actions/steps.action.spec';
import { Step } from '../../models/step.model';

const { initialState } = fromWizard;

describe('WizardReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = fromWizard.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LOAD_WIZARD action', () => {
    it('should set wizardLoading to true', () => {
      const payload = { title: 'Test' };
      const action = new fromActions.LoadWizard(payload);
      const state = fromWizard.reducer(initialState, action);

      expect(state.title).toEqual(payload.title);
      expect(state.loading).toEqual(true);
      expect(state.wizardLoaded).toEqual(false);
      expect(state.stepEntities).toEqual({});
    });
  });

  describe('LOAD_WIZARD_FAIL action', () => {
    it('should return the initial state', () => {
      const action = new fromActions.LoadWizardFail({});
      const state = fromWizard.reducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it('should return the previous state', () => {
      const previousState = { ...initialState, loading: true };
      const action = new fromActions.LoadWizardFail({});
      const state = fromWizard.reducer(previousState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_WIZARD_SUCCESS action', () => {
    it('should populate the stepEntities object and stepOrder array', () => {
      const steps: TestStep[] = [
        new TestStep('testStep1', 'Test Step 1'),
        new TestStep('testStep2', 'Test Step 2'),
      ];
      const entities = {
        [steps[0].id]: steps[0],
        [steps[1].id]: steps[1],
      };
      const stepOrder = [steps[0].id, steps[1].id];
      const action = new fromActions.LoadWizardSuccess({ steps });
      const state = fromWizard.reducer(initialState, action);

      expect(state.loading).toEqual(false);
      expect(state.wizardLoaded).toEqual(true);
      expect(state.stepEntities).toEqual(entities);
      expect(state.stepOrder).toEqual(stepOrder);
      expect(state.currentStepId).toEqual(stepOrder[0]);
    });

    // not sure what scenario this might occur in, because if no steps LOAD_WIZARD_FAIL should have been dispatched
    it('should leave stepEntities and stepOrder empty if no steps were passed in', () => {
      const steps: TestStep[] = [];
      const action = new fromActions.LoadWizardSuccess({ steps });
      const state = fromWizard.reducer(initialState, action);

      expect(state.loading).toEqual(false);
      expect(state.wizardLoaded).toEqual(true);
      expect(state.stepEntities).toEqual({});
      expect(state.stepOrder).toEqual([]);
      expect(state.currentStepId).toBeNull();
    });
  });

  // all do the same thing so it would be a waste to have separate tests
  describe('NEXT_STEP, PREV_STEP, FINISH_STEP actions', () => {
    it('should set stepLoading to true', () => {
      const payload = {
        model: {},
        formValid: true,
        modelValid: true,
      };
      const action = new fromActions.NextStep(payload);
      const state = fromWizard.reducer(initialState, action);

      expect(state.loading).toEqual(true);
    });
  });

  // same as above
  describe('NEXT_STEP_FAIL, PREV_STEP_FAIL, FINISH_WIZARD_FAIL actions', () => {
    it('should set stepLoading to true', () => {
      const action = new fromActions.NextStepFail({});
      const state = fromWizard.reducer(initialState, action);

      expect(state.loading).toEqual(false);
    });
  });

  describe('NEXT_STEP_SUCCESS', () => {
    const stepEntities = {
      '1': new TestStep('1', 'Step 1'),
      '2': new TestStep('2', 'Step 2'),
    };
    const previousState = { ...initialState, stepEntities, stepOrder: ['1', '2'] };

    it('should set current step to next id in order', () => {
      previousState.currentStepId = '1';
      const action = new fromActions.NextStepSuccess({ model: {} });
      const state = fromWizard.reducer(previousState, action);

      expect(state.currentStepId).toEqual('2');
    });

    it('should mark previous step as visisted', () => {
      previousState.currentStepId = '1';
      const previousStepEntity = previousState.stepEntities['1'];
      const action = new fromActions.NextStepSuccess({ model: {} });
      const state = fromWizard.reducer(previousState, action);

      expect(state.stepEntities[state.currentStepId]).not.toBe(previousStepEntity);
      expect(state.stepEntities[previousState.currentStepId].isVisisted).toEqual(true);
    });

    describe('with no current step', () => {
      it('should set current step to the first id in order', () => {
        previousState.currentStepId = null;
        const action = new fromActions.NextStepSuccess({ model: {} });
        const state = fromWizard.reducer(previousState, action);

        expect(state.currentStepId).toEqual('1');
      });
    });
  });

  describe('PREV_STEP_SUCCESS', () => {
    it('should set current step to the previous id in order', () => {
      const previousState = { ...initialState, stepOrder: ['1', '2'], currentStepId: '2' };
      const action = new fromActions.PreviousStepSuccess();
      const state = fromWizard.reducer(previousState, action);

      expect(state.currentStepId).toEqual('1');
    });
  });

  describe('FINISH_WIZARD_SUCCESS', () => {
    it('should set current step to null and loading to false', () => {
      const action = new fromActions.FinishWizardSuccess();
      const state = fromWizard.reducer(initialState, action);

      expect(state.currentStepId).toBeNull();
      expect(state.loading).toEqual(false);
    });
  });

  describe('GO_TO_STEP', () => {
    const stepEntities = {
      '1': new TestStep('1', 'Step 1'),
      '2': new TestStep('2', 'Step 2'),
      '3': new TestStep('3', 'Step 3'),
    };
    const previousState = {
      ...initialState,
      stepEntities,
      stepOrder: ['1', '2', '3'],
      currentStepId: '1',
    };
    describe('when stepToGoTo exists in stepOrder', () => {
      it('should set currentStepId', () => {
        const payload = { stepId: '3', model: {} };
        const action = new fromActions.GoToStep(payload);
        const state = fromWizard.reducer(previousState, action);

        expect(state.currentStepId).toEqual('3');
        expect(state.loading).toEqual(false);
      });

      it('should mark previous step as visited', () => {
        const previousStepEntity = previousState.stepEntities['1'];
        const payload = { stepId: '3', model: {} };
        const action = new fromActions.GoToStep(payload);
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepEntities['3']).not.toBe(previousStepEntity);
        expect(state.stepEntities[previousState.currentStepId].isVisisted).toEqual(true);
      });
    });

    describe('when stepToGoTo does not exist in stepOrder', () => {
      it('should set currentStepId as next step', () => {
        const payload = { stepId: '4', model: {} };
        const action = new fromActions.GoToStep(payload);
        const state = fromWizard.reducer(previousState, action);

        expect(state.currentStepId).toEqual('2');
        expect(state.loading).toEqual(false);
      });
    });
  });

  describe('INSERT_STEP', () => {
    it('should add new entity and add id at the end of stepOrder', () => {
      const step = new TestStep('newStep', 'New Step');
      const stepEntities = { existingStep: new TestStep('existingStep', 'Existing Step') };
      const stepOrder = ['existingStep'];
      const previousState = { ...initialState, stepEntities, stepOrder };
      const action = new fromActions.InsertStep(step);
      const state = fromWizard.reducer(previousState, action);

      expect(state.stepOrder).toEqual(['existingStep', 'newStep']);
      expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
    });
  });

  describe('INSERT_STEP_BEFORE', () => {
    describe('when before step is in middle of stepOrder', () => {
      it('should add entity and insert at correct position', () => {
        const step = new TestStep('newStep', 'New Step');
        const stepEntities = {
          existingStep1: new TestStep('existingStep1', 'Existing Step1'),
          existingStep2: new TestStep('existingStep2', 'Existing Step2'),
        };
        const stepOrder = ['existingStep1', 'existingStep2'];
        const previousState = { ...initialState, stepEntities, stepOrder };
        const action = new fromActions.InsertStepBefore({
          stepToInsert: step,
          insertBefore: 'existingStep2',
        });
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep1', 'newStep', 'existingStep2']);
        expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
      });
    });

    describe('when before step is at the start of stepOrder', () => {
      it('should insert at the start of stepOrder without error', () => {
        const step = new TestStep('newStep', 'New Step');
        const stepEntities = { existingStep: new TestStep('existingStep', 'Existing Step') };
        const stepOrder = ['existingStep'];
        const previousState = { ...initialState, stepEntities, stepOrder };
        const action = new fromActions.InsertStepBefore({
          stepToInsert: step,
          insertBefore: 'existingStep',
        });
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['newStep', 'existingStep']);
        expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
      });
    });

    describe('when before step does not exist', () => {
      it('should insert at the end of stepOrder', () => {
        const step = new TestStep('newStep', 'New Step');
        const stepEntities = { existingStep: new TestStep('existingStep', 'Existing Step') };
        const stepOrder = ['existingStep'];
        const previousState = { ...initialState, stepEntities, stepOrder };
        const action = new fromActions.InsertStepBefore({
          stepToInsert: step,
          insertBefore: 'nonExistentStep',
        });
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep', 'newStep']);
        expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
      });
    });
  });

  describe('INSERT_STEP_AFTER', () => {
    const step = new TestStep('newStep', 'New Step');
    const stepEntities = {
      existingStep1: new TestStep('existingStep1', 'Existing Step1'),
      existingStep2: new TestStep('existingStep2', 'Existing Step2'),
    };
    const stepOrder = ['existingStep1', 'existingStep2'];
    const previousState = { ...initialState, stepEntities, stepOrder };

    describe('when insertAfter is the first step', () => {
      it('should insert in the second spot in stepOrder', () => {
        const action = new fromActions.InsertStepAfter({
          stepToInsert: step,
          insertAfter: 'existingStep1',
        });
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep1', 'newStep', 'existingStep2']);
        expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
      });
    });

    describe('when insertAfter is the last step', () => {
      it('should insert at the end of stepOrder', () => {
        const action = new fromActions.InsertStepAfter({
          stepToInsert: step,
          insertAfter: 'existingStep2',
        });
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep1', 'existingStep2', 'newStep']);
        expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
      });
    });

    describe('when insertAfter does not exist', () => {
      it('should insert at the end of stepOrder', () => {
        const action = new fromActions.InsertStepAfter({
          stepToInsert: step,
          insertAfter: 'existingStepFoo',
        });
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep1', 'existingStep2', 'newStep']);
        expect({ ...state.stepEntities }).toEqual({ ...stepEntities, [step.id]: step });
      });
    });
  });

  describe('REMOVE_STEP_ID', () => {
    const stepEntities = {
      existingStep1: new TestStep('existingStep1', 'Existing Step1'),
      existingStep2: new TestStep('existingStep2', 'Existing Step2'),
    };
    const stepOrder = ['existingStep1', 'existingStep2'];
    const previousState = { ...initialState, stepEntities, stepOrder };

    describe('when step does not exist', () => {
      it('should return the previous state', () => {
        const action = new fromActions.RemoveStepById('nonExistentStep');
        const state = fromWizard.reducer(previousState, action);

        expect(state).toBe(previousState);
      });
    });

    describe('when step exists', () => {
      it('should remove step from stepEntities and stepOrder', () => {
        const action = new fromActions.RemoveStepById('existingStep2');
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep1']);
        expect(state.stepEntities.existingStep2).toBeUndefined();
      });
    });
  });

  describe('REMOVE_STEP_FILTER', () => {
    const stepEntities = {
      existingStep1: new TestStep('existingStep1', 'Existing Step1'),
      existingStep2: new TestStep('existingStep2', 'Existing Step2'),
      existingStep3: new TestStep('existingStep3', 'Existing Step3'),
    };
    const stepOrder = ['existingStep1', 'existingStep2', 'existingStep3'];
    const previousState = { ...initialState, stepEntities, stepOrder };

    describe('when filter returns no matching steps', () => {
      it('should return the previous state', () => {
        const action = new fromActions.RemoveStepByFilter(() => false);
        const state = fromWizard.reducer(previousState, action);

        expect(state).toBe(previousState);
      });
    });

    describe('when filter returns 2 matching steps', () => {
      it('should remove matched steps from stepEntities and stepOrder', () => {
        const action = new fromActions.RemoveStepByFilter(
          step => step.id === 'existingStep1' || step.id === 'existingStep2',
        );
        const state = fromWizard.reducer(previousState, action);

        expect(state.stepOrder).toEqual(['existingStep3']);
        expect(state.stepEntities.existingStep1).toBeUndefined();
        expect(state.stepEntities.existingStep2).toBeUndefined();
      });
    });
  });

  describe('Selectors', () => {
    describe('getTitle', () => {
      it('should return .title', () => {
        const currentState = { ...initialState, title: 'Test Step' };
        const slice = fromWizard.getTitle(currentState);

        expect(slice).toEqual('Test Step');
      });
    });

    describe('getStepEntities', () => {
      it('should return .stepEntities', () => {
        const stepEntities: { [id: number]: Step } = { 1: new TestStep('testStep', 'TestStep') };
        const currentState = { ...initialState, stepEntities };
        const slice = fromWizard.getStepEntities(currentState);

        expect(slice).toBe(stepEntities);
      });
    });

    describe('getStepOrder', () => {
      it('should return .stepOrder', () => {
        const stepOrder = ['1', '2'];
        const currentState = { ...initialState, stepOrder };
        const slice = fromWizard.getStepOrder(currentState);

        expect(slice).toBe(stepOrder);
      });
    });

    describe('getCurrentStepId', () => {
      it('should return .currentStepId', () => {
        const currentStepId = '1';
        const currentState = { ...initialState, currentStepId };
        const slice = fromWizard.getCurrentStepId(currentState);

        expect(slice).toBe(currentStepId);
      });
    });

    describe('getwizardLoaded', () => {
      it('should return .wizardLoaded', () => {
        const wizardLoaded = true;
        const currentState = { ...initialState, wizardLoaded };
        const slice = fromWizard.getWizardLoaded(currentState);

        expect(slice).toBe(wizardLoaded);
      });
    });

    describe('getLoading', () => {
      it('should return .loaded', () => {
        const loading = true;
        const currentState = { ...initialState, loading };
        const slice = fromWizard.getLoading(currentState);

        expect(slice).toBe(loading);
      });
    });
  });
});
