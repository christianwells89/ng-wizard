import { Type } from '@angular/core';

import { StepComponent } from './stepComponent.model';

/**
 *The abstract class that all wizard step classes should extend.
 */
export abstract class Step {
  /**
   *A unique name for this step instance
   */
  abstract id: string;

  /**
   *The step title that will appear to the user
   */
  abstract title: string;

  /**
   *The type of model that this step type will use. It must be a plain JS object or a class with no methods
   *because they will be lost while storing.
   */
  abstract model: Object;

  /**
   *The component that will be shown to the user when this step type is visited.
   */
  abstract component: Type<StepComponent>;

  /**
   *Marks if an instance of this step type has been visited
   */
  isVisisted: boolean = false;

  /**
   *Whether this step should have its model merged with any other steps with the same alias. *Requires alias*
   */
  merge: boolean = false;

  /**
   *Whether all steps with the same alias will have their model put into an array. *Requires alias*
   */
  asArray: boolean = false;

  /**
   *This step's model will be added to the final model as an object under this alias.
   */
  alias?: string;

  /**
   *This step's default error message.
   */
  errorMessage?: string;

  /**
   *Whether this step should be the first in the wizard. *Currently non-functioning*
   */
  isFirst?: boolean;

  /**
   *Whether this step should be the last in the wizard. *Currently non-functioning*
   */
  isLast?: boolean;

  constructor() {}
}
