import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('passwords.password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordsDoNotMatch: true };
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  form = new FormGroup(
    {
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),

      passwords: new FormGroup({
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(6),
          ],
        }),
      }),

      confirmPassword: new FormControl('', {
        validators: [Validators.required],
      }),

      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),

      address: new FormGroup({
        street: new FormControl('', [Validators.required]),
        number: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
      }),

      role: new FormControl<
        'student' | 'teacher' | 'employee' | 'founder' | 'other'
      >('student', {
        validators: [Validators.required],
      }),

      source: new FormArray([
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
        new FormControl(false, { nonNullable: true }),
      ]),

      agree: new FormControl(false, {
        validators: [Validators.requiredTrue],
      }),
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  get emailIsInvalid() {
    const email = this.form.controls.email;
    return email.touched && email.dirty && email.invalid;
  }

  get passwordIsInvalid() {
    const password = this.form.controls.passwords.controls.password;
    return password.touched && password.dirty && password.invalid;
  }

  get confirmPasswordIsInvalid() {
    const confirmPassword = this.form.controls.confirmPassword;

    return (
      confirmPassword.touched &&
      confirmPassword.dirty &&
      (confirmPassword.invalid ||
        this.form.hasError('passwordsDoNotMatch'))
    );
  }

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-signup-email',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onsignup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Signup successful!', this.form.value);
    this.router.navigate(['/login']);
  }

  onReset() {
    this.form.reset({
      email: '',
      passwords: {
        password: '',
      },
      confirmPassword: '',
      firstName: '',
      lastName: '',
      address: {
        street: '',
        number: '',
        postalCode: '',
        city: '',
      },
      role: 'student',
      source: [false, false, false],
      agree: false,
    });
  }
  onsubmit(){
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  console.log('Signup successful!', this.form.value);
  this.router.navigate(['/login']);
}
}
