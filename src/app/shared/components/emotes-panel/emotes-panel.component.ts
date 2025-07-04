import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { emojiData } from '../../interfaces/emojies.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emotes-panel',
  imports: [CommonModule],
  templateUrl: './emotes-panel.component.html',
  styleUrl: './emotes-panel.component.scss',
})
export class EmotesPanelComponent {
  @Input() dataInput: emojiData[] | [] = [];
  @Output() emotionEmit = new EventEmitter<emojiData | null>();
  @Output() close = new EventEmitter<void>();
}
