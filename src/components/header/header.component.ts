import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'wizard-header',
  template: `
    <div class="panel">
      <div class="row wizard-header">
        <div class="col-6">{{ wizardTitle }}</div>
        <div class="col-6 text-right" [hidden]="!(stepNumber > 0) || !(totalSteps > 0)">
          Step {{ stepNumber }}/{{ totalSteps }}
        </div>
      </div>

      <hr class="blue-hr" />

      <div *ngIf="stepTitle">
        <div class="row">
          <div class="col-12 wizard-sub-header">{{ stepTitle }}</div>
        </div>
        <hr />
      </div>
    </div>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() wizardTitle: string;
  @Input() stepTitle: string;
  @Input() stepNumber: number;
  @Input() totalSteps: number;
}
