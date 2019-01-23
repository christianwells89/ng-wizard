import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[wizardStepHost]'
})
export class StepHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
