import { Component, inject, Inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Adjust the path as necessary
import { user } from '../models/user';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { getUserLoaded, getUserLoading, getUsers, RootReducerState } from '../reducer';
import { Store } from '@ngrx/store';
import { UserListRequestAction, UserListSuccessAction } from '../action/user-action';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'user-component',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  public users: user[] = [];
  public selectedUser: user = { fullName: '', email: '' };
  public isEditing: boolean = false;
  toastr = inject(ToastrService);
  
  constructor(private userService: UserService,private store:Store<RootReducerState>) { }

  ngOnInit(): void {
    this.getAllUsers(); // Call the method to fetch users on component initialization
  }

  public getAllUsers(): void {
    debugger
    try {
        // this.userService.getAllUsers().subscribe(
        //     (data: user[]) => {
        //       this.users = data; // Assign the retrieved users to the users property
        //     }, 
        //     error => {
        //       console.error('Error fetching users:', error); // Handle errors if needed
        //     }
        //   );
        const loading$ = this.store.select(getUserLoading);
    const loaded$ = this.store.select(getUserLoaded);
    const getUserData$ = this.store.select(getUsers);
    combineLatest([loaded$,loading$]).subscribe((data)=>{
        if(!data[0] && !data[1]){
            this.store.dispatch(new UserListRequestAction());
            this.userService.getAllUsers().subscribe(
              (data: user[]) => {
                this.users = data; // Assign the retrieved users to the users property
                this.store.dispatch(new UserListSuccessAction({data}));
               
              }, 
              error => {
                console.error('Error fetching users:', error); // Handle errors if needed
              }
            );
        }
    })
    getUserData$.subscribe((data)=>{
        this.users = data;
    });
    } catch (error) {
        debugger
        console.log(error);
    }
    
  }

  public deleteUser(id:string){
    this.userService.deleteUser(id).subscribe({
        next: (response) => {
          // Check the status code
          if (response.status === 200) {
            console.log('User deleted successfully');
            this.toastr.success("User deleted successfully","success");
            this.getAllUsers();
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

  openAddUserModal() {
    debugger
    this.isEditing = false; // Set to false for adding
    this.selectedUser = { fullName: '', email: '' }; // Reset the user object
    this.openModal();
  }

  openEditUserModal(user: user) {
    debugger
    this.isEditing = true; // Set to true for editing
    this.selectedUser = { ...user}; // Copy user data to selectedUser
    // this.selectedUser.dateOfBirth = this.formatDateForInput(new Date(user.dateOfBirth??""));
    this.openModal();
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  }

  private openModal() {
    var element = document.getElementById('addUserModal');
    if(element!=null){
        const modal = new bootstrap.Modal(element);
        modal.show();
    }
  }
}
