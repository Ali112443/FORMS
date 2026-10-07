  import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  
})
export class SignupComponent  implements OnInit {
private destroyRef = inject(DestroyRef);
private route = inject(Router);

  form = new FormGroup({
    email: new FormControl('',{
      validators: [Validators.required, Validators.email],
  
     }),
  
  password: new FormControl('', [Validators.required, Validators.minLength(6),]),
  confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6),]),
  firstName: new FormControl('', [Validators.required]),
  lastName: new FormControl('', [Validators.required]),
  street: new FormControl('', [Validators.required]),
  number: new FormControl('', [Validators.required]),
  postalCode: new FormControl('', [Validators.required]),
  city: new FormControl('', [Validators.required]),
  });
  
  get emailIsInvalid() {
    return(
     this.form.controls.email.touched &&
           this.form.controls.email.dirty &&
           this.form.controls.email.invalid
    );
          }
          get passwordIsInvalid() {
            return(
              this.form.controls.password.touched &&
              this.form.controls.password.dirty &&
              this.form.controls.password.invalid
            );
          }
          validateConfirmPassword() {
            const password = this.form.controls.password.value;
            const confirmPassword = this.form.controls.confirmPassword.value;
            if (password !== confirmPassword) {
              this.form.controls.confirmPassword.setErrors({ passwordsDoNotMatch: true });
            } else {
              this.form.controls.confirmPassword.setErrors(null);
            }
          }
          constructor(private router: Router) {}

          ngOnInit() {
            const subscription =  this.form.valueChanges.pipe(debounceTime(500)).subscribe({
               next: value =>{
                 window.localStorage.setItem('saved-login-form',
                   JSON.stringify({email: value.email})
                 );
               },
             });
             this.destroyRef.onDestroy(() => { subscription.unsubscribe() });
        
          }

          onsignup() {
            this.validateConfirmPassword();
            if (this.form.valid) {
              // Perform signup logic here
              console.log('Signup successful!', this.form.value);
            } else {
              console.log('Form is invalid. Please check the fields.');
      
            }
   if (this.form.valid) {
      this.router.navigate(['/login']);
    }          }
  onReset() {
    this.form.reset();
  }
}
