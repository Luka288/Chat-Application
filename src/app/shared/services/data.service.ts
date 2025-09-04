import { Injectable } from '@angular/core';
import { Emojies } from '../consts/emotes';
import { of } from 'rxjs';
import { emojiData } from '../interfaces/emojies.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly emojiData = Emojies;

  getEmojies() {
    return of<emojiData[]>(this.emojiData);
  }
}
