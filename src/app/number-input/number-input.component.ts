import {
  AfterViewInit,
  Component,
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
import {debounce, debounceTime, filter, tap} from "rxjs/operators";

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
  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('input') inputElement;

  inputEvent$: Observable<KeyboardEvent>;


  constructor(private validator: ValidatorService, private formatter: FormatterService, public model: ConnectorService) {


  }


  ngOnChanges(changes: SimpleChanges) {

    for (let key in changes) {
      if (key === 'milliSeconds' || key === 'readonly' || key === 'disabled') {
        continue;
      }
      if (key === 'value') {
        this.model.currentValue = (changes[key].currentValue) ? changes[key].currentValue : '';
        this.validator.validate();

        if (!this.readonly) {

          if (this.model.valid) {
            this.formatter.format();
            this.onInputChange();
            this.valueChange.emit(this.model.currentValue);
          }

        } else {
          if (this.model.valid) {
            this.formatter.format();
          }
        }
        continue;
      }
      if (changes[key].currentValue) {
        this.model[key] = changes[key].currentValue
      }
    }
    this.validator.updateRegExp();
    this.onInputChange();
    this.validator.validate();
    this.formatter.format();


  }

  ngOnInit(): void {

    if (this.value) {
      this.model.currentValue = this.value;
    }

  }

  ngAfterViewInit(): void {
    if (this.readonly)
      return

    this.inputEvent$ = fromEvent<KeyboardEvent>(this.inputElement.nativeElement, 'keydown');
    this.inputEvent$.pipe(
      filter((event) => {

        if (event.key === 'Backspace') {
          this.onInputChange();
          return true;
        }

        if (!this.validator.validatorExpression.test(event.key)) {
          event.preventDefault();
          return false;
        }

        if (!this.validator.validatorExpression.test(event.key)) {
          event.preventDefault();
        }
        return this.validator.validatorExpression.test(event.key)
      }),
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

  onInputChange() {
    this.model.currentValue = this.model.currentValue.split(this.model.groupSeparator).join("");
  }

}
