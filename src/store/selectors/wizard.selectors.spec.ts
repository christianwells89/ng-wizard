import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { TestStep } from '../actions/steps.action.spec';

import * as fromReducers from '../reducers/index';
import * as fromActions from '../actions/index';
import * as fromSelectors from '../selectors/wizard.selectors';

describe('Wizard Selectors', () => {
  let store: Store<fromReducers.WizardState>;

  let title: string;
  let step1: TestStep;
  let step2: TestStep;
  let step3: TestStep;
  let steps: TestStep[];
  let stepOrder: string[];
  let stepEntities: { [id: string]: TestStep };

  beforeEach(() => {
    title = 'Test Wizard';

    step1 = new TestStep('step1', 'Step 1');
    step2 = new TestStep('step2', 'Step 2');
    step3 = new TestStep('step3', 'Step 3');

    steps = [step1, step2, step3];

    stepOrder = [steps[0].id, steps[1].id, steps[2].id];
    stepEntities = {
      [steps[0].id]: steps[0],
      [steps[1].id]: steps[1],
      [steps[2].id]: steps[2]
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          wizard: combineReducers(fromReducers.reducers)
        })
      ]
    });

    store = TestBed.get(Store);
  });

  describe('getWizardState', () => {
    it('should return updated state of wizard store slice', () => {
      let result;

      store.select(fromSelectors.getFullWizardState).subscribe(value => (result = value));

      // observable should update result with initial state straight away
      expect(result).toEqual({
        title: null,
        loading: false,
        wizardLoaded: false,
        stepEntities: {},
        stepOrder: [],
        currentStepId: null,
        finished: false
      });

      // will call reducer to update state with steps and title
      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual({
        // initial state
        title: null,
        loading: false,
        wizardLoaded: true,
        stepEntities,
        stepOrder,
        currentStepId: stepOrder[0],
        finished: false
      });
    });
  });

  describe('getTitle', () => {
    it('should return title', () => {
      let result;
      store.select(fromSelectors.getTitle).subscribe(value => (result = value));

      expect(result).toBeNull();

      store.dispatch(new fromActions.LoadWizard({ title }));

      expect(result).toEqual('Test Wizard');
    });
  });

  describe('getStepEntities', () => {
    it('should return steps as entities', () => {
      let result;
      store.select(fromSelectors.getStepEntities).subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(stepEntities);
    });
  });

  describe('getStepOrder', () => {
    it('should return steps order as array of ids', () => {
      let result;
      store.select(fromSelectors.getStepOrder).subscribe(value => (result = value));

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(stepOrder);
    });
  });

  describe('getStepCount', () => {
    it('should return length of stepOrder array', () => {
      let result;
      store.select(fromSelectors.getStepCount).subscribe(value => (result = value));

      expect(result).toEqual(0);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(3);
    });
  });

  describe('getCurrentStepId', () => {
    it('should return current step id', () => {
      let result;
      store.select(fromSelectors.getCurrentStepId).subscribe(value => (result = value));

      expect(result).toBeNull();

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(stepOrder[0]);
    });
  });

  describe('getCurrentStep', () => {
    it('should return current step entity', () => {
      let result;
      store.select(fromSelectors.getCurrentStep).subscribe(value => (result = value));

      expect(result).toBeNull();

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(stepEntities[stepOrder[0]]);
    });
  });

  describe('getCurrentStepNumber', () => {
    it('should return current step number', () => {
      let result;
      store.select(fromSelectors.getCurrentStepNumber).subscribe(value => (result = value));

      expect(result).toEqual(0);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(1);
    });
  });

  describe('getCurrentStepTitle', () => {
    it('should return current step title', () => {
      let result;
      store.select(fromSelectors.getCurrentStepTitle).subscribe(value => (result = value));

      expect(result).toEqual(null);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual('Step 1');
    });
  });

  describe('getWizardLoaded', () => {
    it('should return whether wizard has loaded', () => {
      let result;
      store.select(fromSelectors.getWizardLoaded).subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(true);
    });
  });

  describe('getLoading', () => {
    it('should return whether something is loading', () => {
      let result;
      store.select(fromSelectors.getLoading).subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadWizard({ title }));

      expect(result).toEqual(true);
    });
  });

  describe('isWizardLoading', () => {
    it('should return whether wizard is loading', () => {
      let result;
      store.select(fromSelectors.isWizardLoading).subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadWizard({ title }));

      expect(result).toEqual(true);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(false);
    });
  });

  describe('isStepLoading', () => {
    it('should return whether step is loading', () => {
      let result;
      store.select(fromSelectors.isStepLoading).subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(false); // shouldn't be any onNext action for the first step

      store.dispatch(
        new fromActions.NextStep({
          model: {},
          formValid: true,
          modelValid: true
        })
      );

      expect(result).toEqual(true);
    });
  });

  describe('isWizardFinished', () => {
    it('should return whether wizard is finished', () => {
      let result;
      store.select(fromSelectors.isWizardFinished).subscribe(value => (result = value));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(false);

      const payload = { finish: (data: {}) => of(true) };
      store.dispatch(new fromActions.FinishWizard(payload));

      expect(result).toEqual(false); // shouldn't be finished until it successfully hits the back end

      store.dispatch(new fromActions.FinishWizardSuccess());

      expect(result).toEqual(true);
    });
  });

  describe('isLastStep', () => {
    fit('should return whether current step is last in stepOrder', () => {
      let result;
      store.select(fromSelectors.isLastStep).subscribe(value => (result = value));
      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.NextStepSuccess({ model: { first: true } }));

      expect(result).toEqual(false);

      store.dispatch(new fromActions.NextStepSuccess({ model: { second: true } }));

      expect(result).toEqual(true);
    });
  });

  describe('getCollatedModel', () => {
    it('should return object containing all models', () => {
      let result;
      store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
      store.dispatch(new fromActions.NextStepSuccess({ model: { first: true } }));
      store.dispatch(new fromActions.NextStepSuccess({ model: { second: true } }));
      store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

      expect(result).toEqual({ first: true, second: true, third: true });
    });

    it('should return object containing all previously visited steps', () => {
      let result;

      store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));

      // on first step
      expect(result).toEqual({});

      store.dispatch(new fromActions.NextStepSuccess({ model: { first: true } }));

      // on second step
      expect(result).toEqual({ first: true });

      store.dispatch(new fromActions.NextStepSuccess({ model: { second: true } }));

      // on third step
      expect(result).toEqual({ first: true, second: true });

      store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

      // finished
      expect(result).toEqual({ first: true, second: true, third: true });
    });

    it('should not include models of steps not visited', () => {
      let result;
      store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));
      steps[1].model = { second: true };

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
      store.dispatch(new fromActions.GoToStep({ stepId: 'step3', model: { first: true } }));
      store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

      expect(result).toEqual({ first: true, third: true });
    });

    it('should overwrite model properties with conflicting names', () => {
      let result;
      store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));

      store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
      store.dispatch(new fromActions.NextStepSuccess({ model: { text: 'first' } }));
      store.dispatch(new fromActions.NextStepSuccess({ model: { text: 'second' } }));

      expect(result).toEqual({ text: 'second' });
    });

    describe('with steps using aliases', () => {
      it('should create objects with property names matching aliases', () => {
        let result;
        store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));
        steps[0].alias = 'firstStep';
        steps[1].alias = 'secondStep';

        store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
        store.dispatch(new fromActions.NextStepSuccess({ model: { first: true } }));
        store.dispatch(new fromActions.NextStepSuccess({ model: { second: true } }));
        store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

        expect(result).toEqual({
          firstStep: { first: true },
          secondStep: { second: true },
          third: true
        });
      });

      it('should overwrite models with conflicting aliases', () => {
        let result;
        store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));
        steps[0].alias = 'alias';
        steps[1].alias = 'alias';

        store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
        store.dispatch(new fromActions.NextStepSuccess({ model: { first: true } }));
        store.dispatch(new fromActions.NextStepSuccess({ model: { second: true } }));
        store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

        expect(result).toEqual({
          alias: { second: true },
          third: true
        });
      });

      describe('that are the same, and asArray is true', () => {
        it('should create an array with all models', () => {
          let result;
          store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));
          steps[0].alias = 'alias';
          steps[0].asArray = true;
          steps[1].alias = 'alias';
          steps[1].asArray = true;

          store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
          store.dispatch(new fromActions.NextStepSuccess({ model: { first: true } }));
          store.dispatch(new fromActions.NextStepSuccess({ model: { second: true } }));
          store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

          expect(result).toEqual({
            alias: [{ first: true }, { second: true }],
            third: true
          });
        });
      });

      describe('that are the same, and merge is true', () => {
        it('should merge models together', () => {
          let result;
          store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));
          steps[0].alias = 'alias';
          steps[0].merge = true;
          steps[1].alias = 'alias';
          steps[1].merge = true;

          store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
          store.dispatch(
            new fromActions.NextStepSuccess({ model: { first: true, second: undefined } })
          );
          store.dispatch(
            new fromActions.NextStepSuccess({ model: { first: undefined, second: true } })
          );
          store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

          expect(result).toEqual({
            alias: { first: true, second: true },
            third: true
          });
        });

        it('should overwrite with properties that are not undefined', () => {
          let result;
          store.select(fromSelectors.getCollatedModel).subscribe(value => (result = value));
          steps[0].alias = 'alias';
          steps[0].merge = true;
          steps[1].alias = 'alias';
          steps[1].merge = true;

          store.dispatch(new fromActions.LoadWizardSuccess({ steps }));
          store.dispatch(
            new fromActions.NextStepSuccess({ model: { first: true, second: undefined } })
          );
          store.dispatch(
            new fromActions.NextStepSuccess({ model: { first: false, second: true } })
          );
          store.dispatch(new fromActions.NextStepSuccess({ model: { third: true } }));

          expect(result).toEqual({
            alias: { first: false, second: true },
            third: true
          });
        });
      });
    });
  });
});
