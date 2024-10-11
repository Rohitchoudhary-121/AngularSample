import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { user } from '../models/user'; // Adjust path as necessary
import { UserService } from '../services/user.service';
import { Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
})
export class UserModalComponent {
  @Input() user: user = { fullName: '',  email: ''};
  @Input() isEdit: boolean = false; // Flag to indicate edit mode
  @Output() userSaved = new EventEmitter<void>();
  toastr = inject(ToastrService);

  userForm: FormGroup;

  constructor(private fb: FormBuilder,private userService: UserService) {
    this.userForm = this.fb.group({
      id:[''],
      fullName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (this.isEdit) {
      this.userForm.patchValue(this.user); // Populate form with user data for editing
    } else {
      this.userForm.reset(); // Reset form for adding new user
    }
  }

  saveUser() {
    debugger
    if (this.userForm.valid) {
      if (this.isEdit) {
        // Update logic here
        console.log('Updating user:', this.userForm.value);
        this.userService.updateUser(this.userForm.value).subscribe({
          next: (response) => {
            // Check the status code
            if (response.status === 200) {
              console.log('User updated successfully successfully');
              this.toastr.success("User updated successfully","success");
              this.userSaved.emit();
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
        
      } else {
        // Add logic here
        console.log('Adding new user:', this.userForm.value);
        this.userForm.value.id = "";
        this.userService.saveUser(this.userForm.value).subscribe({
          next: (response) => {
            // Check the status code
            if (response.status === 200) {
              console.log('User added successfully');
              this.toastr.success("User added successfully","success");
              this.userSaved.emit();
              // Handle success (e.g., show a success message)
            }
          },
          error: (error) => {
            // Handle errors based on status code
            if (error.status === 400) {
              console.error('Bad Request: ', error.error);
              this.toastr.error(error.error,"error"); // Handle 400 errors
              // Show error message for invalid data
            } else if (error.status === 500) {
              this.toastr.error(error.error,"error"); // Handle 500 errors
              // Show error message for server errors
            } else {
              this.toastr.error('Unexpected error: ',"error");
              console.error('Unexpected error: ', error);
              // Handle other unexpected errors
            }
          }
        });
      }
      // Close the modal after saving (similar logic as before)
      this.closeModal();
    }
    else {
      // Mark all controls as touched to trigger validation messages
      this.userForm.markAllAsTouched();
    }

  }

  private closeModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }
}
