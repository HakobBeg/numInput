import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ValidatorService} from "../Services/validator.service";
import {FormatterService} from "../Services/formatter.service";
import {ConnectorService} from "../Services/Connector.service";
import {fromEvent, Observable, timer} from "rxjs";
import {debounce, filter} from "rxjs/operators";

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [ConnectorService, FormatterService, ValidatorService]
})
export class NumberInputComponent implements OnInit, AfterViewInit, OnChanges {

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

  reservedValue: string;

  @ViewChild('input') inputElement: ElementRef;

  inputEvent$: Observable<KeyboardEvent>;


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
      debounce(() => timer(this.milliSeconds))
    ).subscribe(() => {
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
    this.reservedValue = this.model.currentValue;
  }

  onSessionInvalidEnd(): void{
    if(!(this.validator.sizeValidator() && this.validator.symbolValidator() && this.validator.fractionValidator())){
          // this.model.currentValue = this.reservedValue;
    }
  }

}
