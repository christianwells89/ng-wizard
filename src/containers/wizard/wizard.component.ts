import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Store, ActionsSubject } from '@ngrx/store';

import { Observable, Subject, of } from 'rxjs';
import { tap, takeUntil, exhaustMap, map, catchError, filter } from 'rxjs/operators';

import { Step } from '../../models/step.model';

import * as fromStore from '../../store';
import { StepContentComponent } from '../../components';

@Component({
  selector: 'ng-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit, OnDestroy {
  @Input() steps?: Step[];
  @Input() title: string;
  @Input() load?: Observable<Step[] | void>;
  /**
   * An object that will be added to the model of the wizard, without needing to be tied to a particular step
   */
  @Input() addToModel?: any = {};
  /**
   * An observable that will return either false - to keep tab open, string - to redirect to url, void (same as true) - to close tab.
   * Any error thrown with a string will display that string in an error notification.
   */
  @Input() finish: (data: {}) => Observable<boolean | string | void>;

  @ViewChild(StepContentComponent) stepContent: StepContentComponent;

  public wizardLoading$: Observable<boolean> = this.store.select(fromStore.isWizardLoading);
  public wizardLoaded$: Observable<boolean> = this.store.select(fromStore.getWizardLoaded);
  public wizardFinished$: Observable<boolean> = this.store.select(fromStore.isWizardFinished);
  public wizardTitle$: Observable<string>;
  public stepTitle$: Observable<string> = this.store.select(fromStore.getCurrentStepTitle);
  public currentStep$: Observable<Step> = this.store.select(fromStore.getCurrentStep);
  public currentStepNumber$: Observable<number> = this.store.select(fromStore.getCurrentStepNumber);
  public stepCount$: Observable<number> = this.store.select(fromStore.getStepCount);
  public isStepLoading$: Observable<boolean> = this.store.select(fromStore.isStepLoading);
  public isLastStep$: Observable<boolean> = this.store.select(fromStore.isLastStep);

  private destroyed$ = new Subject<boolean>();

  constructor(
    private actions$: ActionsSubject,
    private store: Store<fromStore.WizardState>,
    private docTitle: Title,
  ) {}

  ngOnInit() {
    this.store.dispatch(
      new fromStore.LoadWizard({
        title: this.title,
        load: this.load,
        steps: this.steps,
        extraModel: this.addToModel,
      }),
    );

    this.wizardTitle$ = this.store
      .select(fromStore.getTitle)
      .pipe(tap(title => this.docTitle.setTitle(`${this.docTitle.getTitle()} - ${title}`)));

    // this should be an effect, but there's no easy way to get the finish observable to that effect (because it can't be kept in the store since it makes the store not serialisable)
    this.actions$
      .pipe(
        takeUntil(this.destroyed$),
        filter(action => action.type === fromStore.wizardActionTypes.FINISH_WIZARD),
        exhaustMap((action: fromStore.FinishWizard) => {
          return this.finish(action.payload.collatedModel).pipe(
            map(result => {
              let redirectUrl,
                closeWindow = true;
              if (typeof result === 'boolean') {
                closeWindow = result;
              } else if (typeof result === 'string') {
                redirectUrl = result;
              }

              return new fromStore.FinishWizardSuccess(closeWindow, redirectUrl);
            }),
            catchError(error => of(new fromStore.FinishWizardFail(error))),
          );
        }),
      )
      .subscribe(action => this.store.dispatch(action));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  next() {
    const component = this.stepContent.currentComponent;
    this.store.dispatch(
      new fromStore.NextStep({
        model: component.model,
        formValid: !component.stepForm || component.stepForm.valid,
        modelValid: !component.isModelValid || component.isModelValid(component.model),
        onNext: component.onNext,
      }),
    );
  }

  previous() {
    this.store.dispatch(new fromStore.PreviousStep());
  }
}
