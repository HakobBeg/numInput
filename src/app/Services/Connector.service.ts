import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class ConnectorService {


  min: number;
  max: number;
  fractionDigits: number;
  groupSeparator: string;
  decimalSeparator: string;
  currentValue: string
  valid: boolean;

  constructor() {
    this.currentValue = '';
    this.groupSeparator = ','
    this.decimalSeparator = '.'
    this.valid = true;
  }


}
