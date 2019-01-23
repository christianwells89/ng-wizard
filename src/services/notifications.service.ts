import { Injectable } from '@angular/core';

import { ToastrService, ActiveToast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private baseConfig: any = { closeButton: true, disableTimeOut: true, progressBar: true };

  constructor(public toastr: ToastrService) {}

  error(message: string, title: string = 'Error'): ActiveToast<any> {
    return this.toastr.error(message, title, { ...this.baseConfig });
  }

  success(message: string, title: string = 'Success'): ActiveToast<any> {
    return this.toastr.success(message, title, { ...this.baseConfig, disableTimeOut: false });
  }

  clear(): void {
    this.toastr.clear();
  }
}
