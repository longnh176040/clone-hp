import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public ContactForm: FormGroup;
  constructor(
    private readonly _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ContactForm = this._formBuilder.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      content: [null, [Validators.required]],
    });
  }

  submitForm(){
    console.log(
      "Submit"
    )
  }
}
