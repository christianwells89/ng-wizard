import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'wizard-loading',
  template: `
    <div class="container">
      <div class="card card-body bg-light text-center">
        <h3>
          <fa-icon [icon]="fontSpinner" spin="true"></fa-icon>&nbsp;&nbsp;&nbsp;&nbsp;Your wizard is
          loading...
        </h3>
      </div>
    </div>
  `,
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  public fontSpinner = faCog;
}
