import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ComponentFactoryResolver
} from '@angular/core';

import { cloneDeep } from 'lodash';

import { StepHostDirective } from '../../directives';
import { Step } from '../../models/step.model';
import { StepComponent } from '../../models/stepComponent.model';

@Component({
  selector: 'wizard-step-content',
  template: `
    <ng-template wizardStepHost></ng-template>
  `,
  styleUrls: ['./step-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepContentComponent implements OnChanges {
  @Input() step: Step;

  @ViewChild(StepHostDirective) stepHost: StepHostDirective;

  currentComponent: StepComponent;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.step && changes.step.currentValue) {
      this.loadStep();
    }
  }

  // the way this works means the components types can't be serialised and saved in the store for later retrieval
  // https://stackoverflow.com/a/42951200 - this could be a way around it, but would require extra code in each stepComponent
  loadStep() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.step.component
    );

    const viewContainerRef = this.stepHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.currentComponent = componentRef.instance;

    this.currentComponent.model = cloneDeep(this.step.model);
    // TODO set focus on the first input element
    // this._setFocus();
  }

  // private _setFocus() {
  //   debugger;
  //   if (this.firstInput) {
  //     this.firstInput.nativeElement.focus();
  //   }
  // }
}
