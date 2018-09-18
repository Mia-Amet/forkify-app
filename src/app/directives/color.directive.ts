import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[my-color]'
})
export class ColorDirective implements OnChanges {
  primary: string = '#34cbbf';
  primaryLight: string = '#5fe2c0';
  secondary: string = '#ec5358';
  secondaryLight: string = '#B42845';

  @Input('my-color') color: string | 'primary' | 'secondary' | 'primary-light' | 'secondary-light';
  @Input() prop: string | string[];

  constructor(
    private element: ElementRef,
    private render: Renderer2
  ) { }

  ngOnChanges() {
    const color = this.color === 'primary' ? this.primary
      : this.color === 'secondary' ? this.secondary
      : this.color === 'primary-light' ? this.primaryLight
      : this.color === 'secondary-light' ? this.secondaryLight
      : this.color.match(/#[a-zA-Z0-9]{6}/) ? this.color : '#1d2328';

    if (!this.prop) this.prop = 'background';
    if (typeof this.prop === 'string') {
      this.render.setStyle(this.element.nativeElement, this.prop, color);
    } else {
      this.prop.forEach(prop => {
        this.render.setStyle(this.element.nativeElement, prop, color);
      });
    }
  }
}
