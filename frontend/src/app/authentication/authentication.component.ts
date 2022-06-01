import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.signupForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      phone: new FormControl('',[Validators.required]),
      gender: new FormControl('')
    });
  }

  showError(key, mess){
    document.getElementById(key + '_error').innerHTML = mess;
}

  onLogin(): void {
    this.authService.doEmailLogin(this.loginForm.value).then(res => {
      // this.router.navigate(['/']);
      this.location.back();
    }).catch(err => {
      alert(err.message);
    })
  }

  onSignup(): void {
    let phone= this.signupForm.value.phone;
    let email= this.signupForm.value.email;
    if(phone != '' &&  !/^(0[35789][0-9]{8})$/.test(phone)) {
      if(
        email != /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
      this.showError('phone', '*Vui lòng kiểm tra lại Phone')
      this.showError('email', '*Vui lòng kiểm tra lại Email')
    }
    }
    else {
      this.authService.register(this.signupForm.value)
      .then(res => {
        alert('Đăng kí thành công. Hãy kiểm tra email và xác nhận để có thể mua hàng trực tuyến');
        this.router.navigate(['/']);
      })
      .catch(err => {
        alert(err.message)
      })
    }

    
  }

  

  goToPreviousPage(): void {
    this.location.back();
  }

  toggleForm(): void {
    const formWrapper = document.querySelector('.form-box');
    formWrapper.classList.toggle('active');
  }

}
