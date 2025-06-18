import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { AlertData } from '../interfaces/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomAlertsService {
  private message = new BehaviorSubject<string | null>(null);
  private display = new BehaviorSubject<boolean>(false);

  private type = new BehaviorSubject<
    'success' | 'error' | 'info' | 'warning' | null
  >(null);

  alert$: Observable<AlertData> = combineLatest([
    this.message,
    this.type,
    this.display,
  ]).pipe(
    map(([message, type, display]) => ({
      message: message ?? '',
      type: type ?? undefined,
      display,
    }))
  );

  displayAlert(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ) {
    if (!message) {
      throw new Error('Alert message cannot be empty');
    }

    this.message.next(message);
    this.type.next(type);
    this.display.next(true);

    setTimeout(() => {
      this.display.next(false);

      setTimeout(() => {
        this.message.next(null);
        this.type.next(null);
      }, 300);
    }, 3000);
  }

  closeAlert() {
    this.display.next(false);
    this.message.next(null);
    this.type.next(null);
  }
}
