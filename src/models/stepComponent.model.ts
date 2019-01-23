import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

export interface StepComponent {
  /**
   *Step's model data.
   */
  model: Object;

  /**
   *Step's form, used to check all required fields have been filled in when next is clicked.
   */
  stepForm?: FormGroup;

  /**
   *An optional observable to run when next is clicked. If it throws an error the message will be shown
   *to the user in a toast.
   */
  onNext?: Observable<any>;

  /**
   *An optional function to run when next is clicked to validate the model. Returning true will validate, false
   *will cause either the step's default error or a generic error to show in an error toast, string will be shown
   *in an error toast
   */
  isModelValid?(model: Object): boolean | string;
}
