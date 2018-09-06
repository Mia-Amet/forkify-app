import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[opacity]',
  host: {
    "(mouseenter)": "onEnter()",
    "(mouseleave)": "onLeave()"
  }
})
export class OpacityDirective {

  constructor(
    private elem: ElementRef,
    private render: Renderer2
  ) { }

  onEnter() {
    this.render.setStyle(this.elem.nativeElement, 'opacity', 1);
  }

  onLeave() {
    this.render.setStyle(this.elem.nativeElement, 'opacity', 0.85);
  }
}
