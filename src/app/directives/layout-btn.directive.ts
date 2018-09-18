import { Directive, ElementRef, Renderer2, OnChanges, Input } from '@angular/core';

@Directive({
  selector: '[layout-btn]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class LayoutBtnDirective implements OnChanges {
  btnStyle = {
    'background-color': 'rgba(19, 24, 29, 0.65)',
    'padding': '20px',
    'color': '#95B0B4',
    'transition': 'background-color 0.2s ease-in-out',
    'font': "400 13px/1.5% 'Montserrat', sans-serif",
    'outline': 'none',
    'border': 'none',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'width': 'inherit',
    'height': 'inherit'
  };
  primary: string = '#34cbbf';
  primaryLight: string = '#60e7c5';
  secondary: string = '#ec5358';
  secondaryLight: string = '#B42845';
  lightBg: string = 'rgba(234, 240, 237, 0.75)';
  darkBg: string = 'rgba(19, 24, 29, 0.75)';
  amt: number;

  @Input('layout-btn') color: string | 'primary' | 'secondary' | 'primary-light' | 'secondary-light';
  @Input() bgColor: 'light' | 'dark';
  @Input() hover: 'lighter' | 'darker';
  @Input() size?: number;
  @Input() weight?: number;
  @Input() font?: string;
  @Input() width?: number;
  @Input() height?: number;

  constructor(
    private element: ElementRef,
    private render: Renderer2
  ) { }

  onMouseEnter() {
    this.render.setStyle(this.element.nativeElement, 'cursor', 'pointer');
    this.render.setStyle(this.element.nativeElement, 'background-color', this.highlight(this.btnStyle['background-color']));
  }

  onMouseLeave() {
    this.render.setStyle(this.element.nativeElement, 'background-color', this.btnStyle['background-color']);
  }

  private highlight(currentColor: string): string {
    const colorNums = currentColor.slice(5, -1).split(', ');
    return `rgba(${+colorNums[0] + this.amt}, ${+colorNums[1] + this.amt}, ${+colorNums[2] + this.amt}, 0.55)`;
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
    if (this.width) {
      this.btnStyle.width = `${this.width}px`
    }
    if (this.height) {
      this.btnStyle.height = `${this.height}px`
    }

    this.btnStyle['background-color'] = this.bgColor === 'light' ? this.lightBg : this.darkBg;
    this.amt = this.hover === 'lighter' ? 20 : -20;

    if (this.element.nativeElement.children) {
      for (let child of this.element.nativeElement.children) {
        if (child.toString() === '[object SVGSVGElement]') {
          this.render.setStyle(child, 'fill', this.btnStyle.color);
          this.render.setStyle(child, 'margin', '0 6px');
        }
      }
    }

    for (let prop in this.btnStyle) {
      this.render.setStyle(this.element.nativeElement, prop, this.btnStyle[prop]);
    }
  }
}
