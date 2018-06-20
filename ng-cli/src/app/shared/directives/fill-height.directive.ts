import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[fill-height]'
})
export class FillHeightDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.resize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize();
  }

  resize() {
    this.el.nativeElement.style.overflow = 'auto';
    const windowHeight = window.innerHeight;
    const elementOffsetTop = this.getElementOffsetTop();

    this.el.nativeElement.style.height = windowHeight - elementOffsetTop + 'px';
  }

  private getElementOffsetTop() {
    return this.el.nativeElement.getBoundingClientRect().top;
  }
}