import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faCheckCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'wizard-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  @Input() isFirstStep: boolean;
  @Input() isLastStep: boolean;
  @Input() isStepLoading: boolean;

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  @ViewChild('arrowIcon') arrowIcon: TemplateRef<any> | null = null;
  @ViewChild('spinnerIcon') spinnerIcon: TemplateRef<any> | null = null;
  @ViewChild('checkIcon') checkIcon: TemplateRef<any> | null = null;

  get nextIcon(): TemplateRef<any> | null {
    if (this.isStepLoading) {
      return this.spinnerIcon;
    } else if (this.isLastStep) {
      return this.checkIcon;
    } else {
      return this.arrowIcon;
    }
  }

  fontPrev = faArrowAltCircleLeft;
  fontNext = faArrowAltCircleRight;
  fontCheck = faCheckCircle;
  fontSpinner = faSpinner;

  previousStep() {
    this.previous.emit();
  }

  nextStep() {
    this.next.emit();
  }
}
