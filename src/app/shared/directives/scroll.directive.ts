import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';
import { chatMessage } from '../interfaces/chat.interface';

@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  @Input() appScroll: chatMessage[] | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('appScroll' in changes) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  scrollToBottom(): void {
    const el = this.el.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
