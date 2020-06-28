import {Injectable} from '@angular/core';
import {ConnectorService} from "./Connector.service";

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  validatorExpression: RegExp;

  constructor(private connector: ConnectorService) {
    this.updateRegExp();
  }

  updateRegExp(): void {
    this.validatorExpression = new RegExp(
      '^' +
      '[-]?' +
      '\\d*?' +
      `\\${(this.connector.decimalSeparator) ? this.connector.decimalSeparator : '.'}?` +
      '\\d*' +
      '$'
    )
  }


  symbolValidator(expression: string): boolean {
    return this.validatorExpression.test(expression);
  }

  sizeValidator(expression: string): boolean {

    if (this.connector.max) {
      if (this.connector.min) {
        return this.connector.min < parseFloat(expression) && parseFloat(expression) < this.connector.max;
      } else {
        return parseFloat(expression) < this.connector.max;
      }
    } else {
      if (this.connector.min) {
        return parseFloat(expression) > this.connector.min
      } else {
        return true;
      }
    }
  }

  fractionValidator(expression: string): boolean {

    if (expression.indexOf(this.connector.decimalSeparator) >= 0) {
      return expression.split(this.connector.decimalSeparator)[1].length <= this.connector.fractionDigits;
    }
    return true;
  }


  validate(): void {
    if (this.connector.currentValue.length === 0) {
      this.connector.valid = true
      return
    }
    this.connector.valid = this.symbolValidator(this.connector.currentValue) && this.sizeValidator(this.connector.currentValue) && this.fractionValidator(this.connector.currentValue);
  }


}
