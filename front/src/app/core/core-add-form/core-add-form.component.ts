import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreService } from '../core.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-core-add-form',
  templateUrl: './core-add-form.component.html',
  styleUrls: ['./core-add-form.component.css']
})
export class CoreAddFormComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private coreService: CoreService, public bsModalRef: BsModalRef) { }

  is_submited = false;

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surname: ['', Validators.maxLength(50)],
      email: ['', [Validators.email, Validators.maxLength(50)]],
      phone: ['', Validators.pattern('\\+79[0-9]{9}')],
    })
  }

  onSubmitNewItem() {

    this.is_submited = true;

    if (this.form.invalid) {
      return;
    }
    this.is_submited = false;
    this.coreService.createItem(this.form.value);
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
