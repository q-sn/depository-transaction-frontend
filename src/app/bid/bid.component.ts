import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { BidService } from '../services/bid.service';
import { CustodyService } from '../services/custody.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  paperTypes = [
    {value: 'вексель', viewValue: 'Вексель'},
    {value: 'облигация', viewValue: 'Облигация'},
    {value: 'акция', viewValue: 'Акция'},
    {value: 'закладная', viewValue: 'Закладная'},
    {value: 'коносамент', viewValue: 'Коносамент'}
  ];
  
  persons: any;
  custodys: any;
  
  form: FormGroup;
  addButtonStatus: boolean = true;
  isAdded: boolean = false;
  addButtonText: string = 'Добавить';

  constructor(private bidService: BidService, private personService: PersonService, private custodyService: CustodyService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'paperType': new FormControl(null, [Validators.required]),
      'paperCost': new FormControl(null, [Validators.required]),
      'persentByStorage': new FormControl(null, [Validators.required]),
      'minCostByStorage': new FormControl(null, [Validators.required]),
      'personId': new FormControl(null, [Validators.required]),
      'custodyId': new FormControl(null)
    });
    
    this.personService.getPersons().subscribe((res: any[]) => {
      this.persons = res.reverse();
    })
    
    this.custodyService.getCustodys().subscribe((res: any[])  => {
      this.custodys = res.reverse();
    })
  }
  
  onSubmit() {
    const formData = this.form.value;
    this.addButtonText = 'Обработка...';
    this.addButtonStatus = false;

    this.bidService.addBid(formData)
      .subscribe((serverResponse) => {
        this.addButtonText = 'Добавлено';
        this.addButtonStatus = true;
        this.isAdded = true;
        
        this.resetForm(this.form);
      });
  }
  
  resetForm(formGroup: FormGroup) {
    let control = null;
    formGroup.reset();
    formGroup.markAsUntouched();
    Object.keys(formGroup.controls).forEach((name) => {
      control = formGroup.controls[name];
      control.setErrors(null);
    });
  }

}
