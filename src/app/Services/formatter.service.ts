import {Injectable} from '@angular/core';
import {ConnectorService} from "./Connector.service";

@Injectable({
  providedIn: 'root'
})
export class FormatterService {


  constructor(private connector: ConnectorService) {
  }

  addGroupSeparatorToNumber(): void {
    this.connector.currentValue = this.connector.currentValue.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, this.connector.groupSeparator);
  }


  setZero(): void {

    let dotIndex = this.connector.currentValue.indexOf(this.connector.decimalSeparator);
    if (dotIndex >= 0) {
      if (dotIndex === 0) {
        this.connector.currentValue = '0' + this.connector.currentValue;
        return
      }
      if (!/[0-9]/.test(this.connector.currentValue.charAt(dotIndex - 1))) {
        this.connector.currentValue = this.connector.currentValue.slice(0, dotIndex) + '0' + this.connector.currentValue.slice(dotIndex, this.connector.currentValue.length);
      }
    }
  }

  removeExcessiveZeroes(): void {
    let sign = '';
    if (this.connector.currentValue[0] === '-' || this.connector.currentValue[0] === '+') {
      sign = this.connector.currentValue[0];
      this.connector.currentValue = this.connector.currentValue.slice(1, this.connector.currentValue.length);
    }

    while (true) {
      if (this.connector.currentValue.startsWith('0') && this.connector.currentValue[1] !== '.' && this.connector.currentValue.length > 1) {
        this.connector.currentValue = this.connector.currentValue.slice(1, this.connector.currentValue.length);
      } else {
        break;
      }
    }
    this.connector.currentValue = sign + this.connector.currentValue;
  }


  format(): void {
    this.removeExcessiveZeroes();
    this.setZero();
    this.addGroupSeparatorToNumber()
  }

}
