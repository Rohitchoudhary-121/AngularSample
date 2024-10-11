import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent {
  registrationForm: FormGroup;
  toastr = inject(ToastrService); 
  
  constructor(private fb: FormBuilder,private userService: UserService,private router: Router) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {

  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    debugger
    if (this.registrationForm.valid) {
        console.log('Updating user:', this.registrationForm.value);
        this.registrationForm.value.id = "";
        this.userService.loginUser(this.registrationForm.value).subscribe({
          next: (response) => {
            console.log(response);
            if(response.body.token==null){
              this.toastr.error("Credentials are wrong");
              return;
            }
            this.handleLoginResponse(response.body.token);
            if (response.status === 200) {
              console.log('User saved successfully successfully');
              this.toastr.success("Logged in successfully","success");
              this.router.navigate(['']);
            }
          },
          error: (error) => {
            if (error.status === 400) {
              console.error('Bad Request: ', error.error);
              this.toastr.error(error.error,"error");
            } else if (error.status === 500) {
              console.error('Server Error: ', error.error); 
              this.toastr.error(error.error,"error");
            } else {
              console.error('Unexpected error: ', error);
              this.toastr.error('Unexpected error: ',"error");
            }
          }
        });
      }
      else{
        this.registrationForm.markAllAsTouched();
      }
  }

  handleLoginResponse(response: any): void {
    debugger
    if (response) {
      localStorage.setItem('token', response); // Store the token
    }
  }
}
