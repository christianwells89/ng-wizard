import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, tap, switchMap, catchError, withLatestFrom, filter, delay } from 'rxjs/operators';

import { Step } from '../../models/step.model';
import { NotificationsService } from '../../services/notifications.service';

import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import * as wizardActions from '../actions/wizard.action';

@Injectable()
export class WizardEffects {
  constructor(
    private actions$: Actions,
    private notifications: NotificationsService,
    private store: Store<fromReducers.WizardState>,
  ) {}

  @Effect({ dispatch: false })
  clearNotifications$ = this.actions$.pipe(
    ofType(
      wizardActions.wizardActionTypes.NEXT_STEP,
      wizardActions.wizardActionTypes.PREV_STEP,
      wizardActions.wizardActionTypes.NEXT_STEP_FAIL,
      wizardActions.wizardActionTypes.PREV_STEP_FAIL,
      wizardActions.wizardActionTypes.NEXT_STEP_SUCCESS,
      wizardActions.wizardActionTypes.PREV_STEP_SUCCESS,
    ),
    tap(() => this.notifications.clear()),
  );

  @Effect({ dispatch: false })
  failActions$ = this.actions$.pipe(
    ofType(
      wizardActions.wizardActionTypes.LOAD_WIZARD_FAIL,
      wizardActions.wizardActionTypes.NEXT_STEP_FAIL,
      wizardActions.wizardActionTypes.PREV_STEP_FAIL,
      wizardActions.wizardActionTypes.FINISH_WIZARD_FAIL,
    ),
    map((action: { payload: any }) => action.payload),
    tap(error => {
      let message: string;

      if (typeof error === 'string') {
        message = error;
      } else {
        console.log(error);
        message = 'An unexpected error has occurred';
      }

      this.notifications.error(message);
    }),
  );

  @Effect()
  loadWizard$ = this.actions$.pipe(
    ofType(wizardActions.wizardActionTypes.LOAD_WIZARD),
    map((action: wizardActions.LoadWizard) => action.payload),
    switchMap(payload => {
      const { steps = [], load = of([]), extraModel = {} } = payload; // make an observable that completes instantly if there isn't a load, to save separate code handling not passing it in

      // something has changed in the newer version of rxjs and has broken this
      // return load.pipe(
      //   map((loadedSteps: Step[]) => {
      //     if (loadedSteps.length > 0) {
      //       return new wizardActions.LoadWizardSuccess({
      //         steps: loadedSteps,
      //         extraModel
      //       });
      //     } else if (steps.length > 0) {
      //       return new wizardActions.LoadWizardSuccess({ steps, extraModel });
      //     } else {
      //       return new wizardActions.LoadWizardFail(
      //         'No steps have been provided'
      //       );
      //     }
      //   }),
      //   catchError(error => of(new wizardActions.LoadWizardFail(error)))
      // );
      return of(
        new wizardActions.LoadWizardSuccess({
          steps: steps,
          extraModel,
        }),
      );
    }),
  );

  // at some point this could do some validation? maybe the next step's component has a resolve?
  @Effect()
  prevStep$ = this.actions$.pipe(
    ofType(wizardActions.wizardActionTypes.PREV_STEP),
    map(() => new wizardActions.PreviousStepSuccess()),
  );

  @Effect()
  nextStep$ = this.actions$.pipe(
    ofType(wizardActions.wizardActionTypes.NEXT_STEP),
    map((action: wizardActions.NextStep) => action.payload),
    switchMap(payload => {
      const { formValid, modelValid, model, onNext = of([]) } = payload; // make an observable that completes instantly if there isn't an onNext, to save separate code handling not passing it in
      const isValid = formValid && modelValid;

      if (isValid === true) {
        return onNext.pipe(
          map(() => new wizardActions.NextStepSuccess({ model: model })),
          catchError(error => of(new wizardActions.NextStepFail(error))),
        );
      } else {
        return of(new wizardActions.NextStepFail(isValid || 'Please correct errors'));
      }
    }),
  );

  @Effect()
  checkIfWizardFinished$ = this.actions$.pipe(
    ofType(wizardActions.wizardActionTypes.NEXT_STEP_SUCCESS),
    withLatestFrom(
      this.store.select(fromSelectors.isLastStep),
      this.store.select(fromSelectors.getCurrentStep),
    ),
    filter(([, isLastStep, step]) => isLastStep && step.isVisisted),
    withLatestFrom(this.store.select(fromSelectors.getCollatedModel)),
    map(([[], collatedModel]) => new wizardActions.FinishWizard({ collatedModel })),
  );

  // @Effect()
  // finishWizard$ = this.actions$.ofType(wizardActions.wizardActionTypes.FINISH_WIZARD).pipe(
  //   withLatestFrom(this.store.select(fromSelectors.getCollatedModel)),
  //   map(([, collatedModel]) => new wizardActions.FinishWizardProcess({ collatedModel }))
  // );

  @Effect({ dispatch: false })
  finishWizardSuccess$ = this.actions$.pipe(
    ofType(wizardActions.wizardActionTypes.FINISH_WIZARD_SUCCESS),
    tap((action: wizardActions.FinishWizardSuccess) => {
      this.notifications.success(action.payload.message);
    }),
    delay(5000),
    tap(action => {
      if (action.payload.redirectUrl) {
        window.location.href = action.payload.redirectUrl;
      } else if (action.payload.closeWindow) {
        window.close();
      }
    }),
  );
}
