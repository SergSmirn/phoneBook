import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../core.service';
import { BsModalRef } from 'ngx-bootstrap';
import { ICore } from '../icore';

@Component({
  selector: 'app-core-edit-form',
  templateUrl: './core-edit-form.component.html',
  styleUrls: ['./core-edit-form.component.css']
})
export class CoreEditFormComponent implements OnInit {

  form : FormGroup;
  is_submited = false;
  item: ICore;

  constructor(private formBuilder: FormBuilder, private coreService: CoreService, public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.maxLength(50)]],
      surname: [this.item.surname, Validators.maxLength(50)],
      email: [this.item.email, [Validators.email, Validators.maxLength(50)]],
      phone: [this.item.phone, Validators.pattern('\\+79[0-9]{9}')],
    })
  }

  onSubmitNewItem() {

    this.is_submited = true;

    if (this.form.invalid) {
      return;
    }
    this.is_submited = false;
    this.item.name = this.form.value.name;
    this.item.surname = this.form.value.surname;
    this.item.email = this.form.value.email;
    this.item.phone = this.form.value.phone;
    this.coreService.updateItem(this.item);
    this.form.reset();
    this.bsModalRef.hide();
  }

  getValidation(error: string) {
    return this.form.get(error).invalid && (this.form.get(error).touched || this.is_submited);
  }

  getErrors(errors: any) {
    return this.coreService.getErrors(errors);
  }
}
