import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-hotobservable',
  templateUrl: './hotobservable.component.html',
  styleUrls: ['./hotobservable.component.css']
})
export class HotobservableComponent implements OnInit, OnDestroy {

  @ViewChild("myCanvas", { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  canvasClick$!: Observable<MouseEvent>;
  manualCanvasClick$!: Observable<MouseEvent>;

  ctx!: CanvasRenderingContext2D;
  canvasSubscription!: Subscription;
  canvasManualSubscription!: Subscription;

  constructor() { }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvasRef.nativeElement.getContext("2d") as CanvasRenderingContext2D;

    this.UpdateCanvasSize();
    window.addEventListener("resize", this.UpdateCanvasSize.bind(this));

    this.canvasClick$ = fromEvent<MouseEvent>(canvas, "click");
    this.manualCanvasClick$ = new Observable<MouseEvent>(subscriber => {
      const canvas = this.canvasRef.nativeElement;
      const clickHandlerFn = (event: MouseEvent) => subscriber.next(event)
      canvas.addEventListener('click', clickHandlerFn);
      //Teardown logic
      return () => canvas.removeEventListener('click', clickHandlerFn)
    });

    this.canvasSubscription = this.canvasClick$.subscribe(event => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(`FromEvent Observ.: x: ${x}, y: ${y}`);
      this.drawPoint(x, y);
      this.drawCoordinates(x, y);
    });

    this.canvasManualSubscription = this.manualCanvasClick$.subscribe(event => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(`Manual Observable: x: ${x}, y: ${y}`);
    });

  }

  drawPoint(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawCoordinates(x: number, y: number) {
    this.ctx.fillText(`(${x}, ${y})`, x + 5, y - 5);
  }

  ngOnInit(): void {
  }

  UpdateCanvasSize() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  ngOnDestroy(): void {
    this.canvasSubscription.unsubscribe();
    this.canvasManualSubscription.unsubscribe();
    window.removeEventListener("resize", this.UpdateCanvasSize);
  }

}