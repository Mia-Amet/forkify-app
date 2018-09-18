import { Directive, ElementRef, Renderer2, OnChanges, Input } from '@angular/core';

@Directive({
  selector: '[link-btn]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class LinkBtnDirective implements OnChanges {
  btnStyle = {
    'background': 'transparent',
    'padding': '0',
    'color': '#95B0B4',
    'transition': 'color 0.2s ease-in-out',
    'font': "400 13px/1.5% 'Montserrat', sans-serif",
    'outline': 'none',
    'border': 'none',
    'display': 'flex',
    'align-items': 'center'
  };
  primary: string = '#34cbbf';
  primaryLight: string = '#60e7c5';
  secondary: string = '#ec5358';
  secondaryLight: string = '#B42845';
  amt: number = 20;

  @Input('link-btn') color: string | 'primary' | 'secondary' | 'primary-light' | 'secondary-light';
  @Input() size?: number;
  @Input() weight?: number;
  @Input() font?: string;

  constructor(
    private element: ElementRef,
    private render: Renderer2
  ) { }

  onMouseEnter() {
    this.render.setStyle(this.element.nativeElement, 'cursor', 'pointer');
    this.render.setStyle(this.element.nativeElement, 'color', this.highlight(this.btnStyle.color));
  }

  onMouseLeave() {
    this.render.setStyle(this.element.nativeElement, 'color', this.btnStyle.color);
  }

  private checkValue(value: number): number {
    return value < 0 ? 0 : value > 255 ? 255 : value;
  }

  private highlight(currentColor: string, amt: number = this.amt): string {
    const color = /#/.test(currentColor) ? currentColor.slice(1) : currentColor;
    let colorNumber = parseInt(color, 16);

    let r = this.checkValue((colorNumber >> 16) + amt);
    let b = this.checkValue(((colorNumber >> 8) & 0x00FF) + amt);
    let g = this.checkValue((colorNumber & 0x0000FF) + amt);

    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  }

  ngOnChanges() {
    if (this.color) {
      this.btnStyle.color = this.color === 'primary' ? this.primary
        : this.color === 'secondary' ? this.secondary
        : this.color === 'primary-light' ? this.primaryLight
        : this.color === 'secondary-light' ? this.secondaryLight
        : this.color.match(/#[a-zA-Z0-9]{6}/) ? this.color : '#95B0B4';
    }
    if (this.size) {
      this.btnStyle.font = `400 ${this.size}px/1.5% 'Montserrat', 'Railway', sans-serif`;
    }
    if (this.weight) {
      this.btnStyle.font = `${this.weight}${this.btnStyle.font.slice(3)}`;
    }
    if (this.font) {
      this.btnStyle.font = this.btnStyle.font.replace('Montserrat', this.font);
    }

    if (this.element.nativeElement.children) {
      for (let child of this.element.nativeElement.children) {
        if (child.toString() === '[object SVGSVGElement]') {
          this.render.setStyle(child, 'fill', this.btnStyle.color);
          this.render.setStyle(child, 'margin', '0 2px');
        }
      }
    }

    for (let prop in this.btnStyle) {
      this.render.setStyle(this.element.nativeElement, prop, this.btnStyle[prop]);
    }
  }
}
