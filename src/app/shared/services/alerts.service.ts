import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  alert(title: string, icon: SweetAlertIcon, text = '') {
    Swal.fire({ title, icon, text });
  }

  toast(
    title: string,
    icon: SweetAlertIcon,
    color: string,
    time: number = 1500
  ): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      iconColor: color,
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
    });

    Toast.fire({
      icon,
      title,
    });
  }
}
