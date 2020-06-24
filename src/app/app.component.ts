import {ChangeDetectorRef, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  eMin: number;
  eMax: number;
  eDecSep: string;
  eGrSep: string;
  eMs: number;
  eFrDig: number;
  evalue: string;


  dMin: number;
  dMax: number;
  dDecSep: string;
  dGrSep: string;
  dMs: number;
  dFrDig: number;
  dvalue: string;


  rMin: number;
  rMax: number;
  rDecSep: string;
  rGrSep: string;
  rMs: number;
  rFrDig: number;
  rvalue: string;

  constructor(private ref: ChangeDetectorRef) {
  }

  eChange(event: string): void{
    this.evalue = event;
    this.ref.detectChanges();
  }


  dChange(event: string): void{
    this.dvalue = event;
    this.ref.detectChanges();
  }


  rChange(event: string): void{
    this.dvalue = event;
    this.ref.detectChanges();
  }
}
