import { Component, AfterViewInit, Input, ElementRef, ViewChild} from '@angular/core';
import { fromEvent } from 'rxjs';
import { Instrument } from '../interface/instrument.interface';
import { PlanService } from '../service/plan.service';

@Component({
  selector: 'app-plan-edit',
  templateUrl: './plan-edit.component.html',
  styleUrls: ['./plan-edit.component.css']
})
export class PlanEditComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  width:number = 1000;
  height:number = 500;
  coordinatesUp;
  coordinatesDown;
  ctx: CanvasRenderingContext2D; 
  open: boolean = false;
  instruments: Instrument[];

  openPanel() {
    return this.open = true;
  }
  
  constructor(private standInstrument: PlanService) { }

  async ngOnInit(): Promise<void> {
    this.instruments = await this.standInstrument.getInstumentRequest();
  }
  ngAfterViewInit(): void {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasElement.getContext('2d');

    canvasElement.width = this.width;
    canvasElement.height = this.height;

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';

    this.captureEvents(canvasElement);
  }

  private captureEvents(canvasElement: HTMLCanvasElement) {
    fromEvent(canvasElement, 'mousedown')
      .subscribe((result: MouseEvent) => {
        const rect = canvasElement.getBoundingClientRect();
        this.coordinatesDown = {
          x: result.clientX - rect.left,
          y: result.clientY - rect.top
        };
    });

    fromEvent(canvasElement, 'mousemove').subscribe(() => {
        this.drawOnCanvas();
    });

    fromEvent(canvasElement, 'mouseup').subscribe((result: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
        this.coordinatesUp = {
          x: result.clientX - rect.left,
          y: result.clientY - rect.top
        };
        this.drawOnCanvas();
    });
   }

  private drawOnCanvas() {
    if (!this.ctx) return;

    this.ctx.beginPath();
    if (this.coordinatesDown) {
      this.ctx.moveTo(this.coordinatesDown.x, this.coordinatesDown.y);
      this.ctx.lineTo(this.coordinatesUp.x, this.coordinatesUp.y)
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  clear() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
}