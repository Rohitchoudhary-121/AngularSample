import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  registrationForm: FormGroup;
  toastr = inject(ToastrService); 
  
  StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(private fb: FormBuilder,private userService: UserService,private router:Router) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      age: [''],
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(this.StrongPasswordRegx)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {

  }


  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
        // Update logic here
        console.log('Updating user:', this.registrationForm.value);
        this.registrationForm.value.id = "";
        this.registrationForm.value.age = 0;
        this.userService.saveUser(this.registrationForm.value).subscribe({
          next: (response) => {
            // Check the status code
            if (response.status === 200) {
              console.log('User saved successfully successfully');
              this.toastr.success("User saved successfully","success");
              this.router.navigate(["/login"]);
              // Handle success (e.g., show a success message)
            }
          },
          error: (error) => {
            // Handle errors based on status code
            if (error.status === 400) {
              console.error('Bad Request: ', error.error); // Handle 400 errors
              this.toastr.error(error.error,"error");
              // Show error message for invalid data
            } else if (error.status === 500) {
              console.error('Server Error: ', error.error); // Handle 500 errors
              this.toastr.error(error.error,"error");
              // Show error message for server errors
            } else {
              console.error('Unexpected error: ', error);
              this.toastr.error('Unexpected error: ',"error");
              // Handle other unexpected errors
            }
          }
        });
      }
      else{
        this.registrationForm.markAllAsTouched();
      }
  }
}
