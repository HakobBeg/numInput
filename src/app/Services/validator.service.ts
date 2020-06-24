import {Injectable} from '@angular/core';
import {ConnectorService} from "./Connector.service";

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  validatorExpression: RegExp;

  constructor(private connector: ConnectorService) {

    this.validatorExpression = new RegExp(
      '^' +
      '[-]?' +
      '\\d*?' +
      '\\.?' +
      '\\d*' +
      '$'
    )


  }

  updateRegExp(){

    this.validatorExpression = new RegExp(
      '^' +
      '[-]?' +
      '\\d*?' +
      `\\${(this.connector.decimalSeparator)?this.connector.decimalSeparator:'.'}?` +
      '\\d*' +
      '$'
    )
  }


  symbolValidator(): boolean {
    return this.validatorExpression.test(this.connector.currentValue);
  }

  sizeValidator(): boolean {

    if (this.connector.max) {
      if (this.connector.min) {
        return this.connector.min < parseFloat(this.connector.currentValue) && parseFloat(this.connector.currentValue) < this.connector.max;
      } else {
        return parseFloat(this.connector.currentValue) < this.connector.max;
      }
    } else {
      if (this.connector.min) {
        return parseFloat(this.connector.currentValue) > this.connector.min
      } else {
        return true;
      }
    }
  }

  fractionValidator(): boolean {

    if (this.connector.currentValue.indexOf(this.connector.decimalSeparator) >= 0) {
      return this.connector.currentValue.split(this.connector.decimalSeparator)[1].length <= this.connector.fractionDigits;
    }
    return true;
  }


  validate(): void {
    if(this.connector.currentValue.length === 0) {
      this.connector.valid = true
      return
    }
      this.connector.valid = this.symbolValidator() && this.sizeValidator() && this.fractionValidator();
  }


}
