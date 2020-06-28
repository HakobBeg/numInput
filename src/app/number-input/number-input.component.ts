import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ValidatorService} from "../Services/validator.service";
import {FormatterService} from "../Services/formatter.service";
import {ConnectorService} from "../Services/Connector.service";
import {fromEvent, Observable, ReplaySubject, timer} from "rxjs";
import {debounce, filter, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [ConnectorService, FormatterService, ValidatorService]
})
export class NumberInputComponent implements OnInit, AfterViewInit, OnChanges , OnDestroy{

  @Input() min: number;
  @Input() max: number;
  @Input() milliSeconds: number;
  @Input() fractionDigits: number;
  @Input() groupSeparator: string;
  @Input() decimalSeparator: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  lastValue: string;

  @ViewChild('input') inputElement: ElementRef;

  inputEvent$: Observable<KeyboardEvent>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private validator: ValidatorService, private formatter: FormatterService, public model: ConnectorService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    for (let key in changes) {
      if (!(key === 'milliSeconds' || key === 'readonly' || key === 'disabled')) {
        if (key === 'value' && changes.hasOwnProperty(key)) {
          this.model.currentValue = (changes[key].currentValue) ? changes[key].currentValue : '';
          this.validator.validate();
          if (!this.readonly && this.model.valid) {
            this.formatter.format();
            this.onInputChange();
            this.valueChange.emit(this.model.currentValue);
          } else {
            if (this.model.valid) {
              this.formatter.format();
            }
          }
        } else if (changes[key].currentValue) {
          this.model[key] = changes[key].currentValue
        }
      }
    }
    this.validator.updateRegExp();
    this.onInputChange();
    this.validator.validate();
    this.formatter.format();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.readonly) {
      return
    }

    this.inputEvent$ = fromEvent<KeyboardEvent>(this.inputElement.nativeElement, 'keydown');
    this.inputEvent$.pipe(
      filter((event) => {
        if (event.key === 'Backspace') {
          this.onInputChange();
          return true;
        } else if (!this.validator.validatorExpression.test(event.key)) {
          event.preventDefault();
          return false;
        } else if (!this.validator.validatorExpression.test(event.key)) {
          event.preventDefault();
        }
        return this.validator.validatorExpression.test(event.key)
      }),
      takeUntil(this.destroyed$),
      debounce(() => timer(this.milliSeconds))
    ).subscribe((event) => {

      this.validator.validate();
      if (this.model.valid) {
        if (!this.readonly) {
          this.onInputChange();
          this.valueChange.emit(this.model.currentValue);
        }
        this.formatter.format();
      }
    })

  }

  onInputChange(): void {
    this.model.currentValue = this.model.currentValue.split(this.model.groupSeparator).join("");
  }

  onSessionStart(): void{
    this.lastValue = this.model.currentValue;
  }

  onSessionInvalidEnd(): void{
    if(!(this.validator.sizeValidator(this.model.currentValue) && this.validator.symbolValidator(this.model.currentValue.split(this.model.groupSeparator).join("")) && this.validator.fractionValidator(this.model.currentValue))){
      console.log(this.validator.symbolValidator(this.model.currentValue));
          this.model.currentValue = this.lastValue;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
