import { Component, inject } from '@angular/core';
import { product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { getProductLoaded, getProductLoading, getProducts, RootReducerState } from '../reducer';
import { combineLatest } from 'rxjs';
import { DeleteProductAction, ProductListRequestAction, ProductListSuccessAction } from '../action/product-action';
import * as bootstrap from 'bootstrap';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  public products: product[] = [];
  public selectedProduct: product = { productName: '', type: '' };
  public isEditing: boolean = false;
  toastr = inject(ToastrService);
  
  constructor(private productService : ProductService,private store:Store<RootReducerState>) { }

  ngOnInit(): void {
    this.getAllProducts(); // Call the method to fetch users on component initialization
  }

  public getAllProducts(): void {
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
        const loading$ = this.store.select(getProductLoading);
    const loaded$ = this.store.select(getProductLoaded);
    const getProductData$ = this.store.select(getProducts);
    combineLatest([loaded$,loading$]).subscribe((data)=>{
        if(!data[0] && !data[1]){
            this.store.dispatch(new ProductListRequestAction());
            this.productService.getAllProducts().subscribe(
              (data: product[]) => {
                this.store.dispatch(new ProductListSuccessAction({data}));
              }, 
              (              error: any) => {
                console.error('Error fetching users:', error); // Handle errors if needed
              });
        }
    })
    getProductData$.subscribe((data)=>{
        this.products = data;
    });
    } catch (error) {
        debugger
        console.log(error);
    }
    
  }

  public deleteProduct(id:string){
    this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          // Check the status code
          if (response.status === 200) {
            console.log('User deleted successfully');
            this.toastr.success("Product deleted successfully","success");
            this.store.dispatch(new DeleteProductAction(id));
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

  openAddProductModal() {
    debugger
    this.isEditing = false; // Set to false for adding
    this.selectedProduct = { productName: '', type: '' }; // Reset the user object
    this.openModal();
  }

  openEditProductModal(product: product) {
    debugger
    this.isEditing = true; // Set to true for editing
    this.selectedProduct = { ...product}; // Copy user data to selectedUser
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
    var element = document.getElementById('addProductModal');
    if(element!=null){
        const modal = new bootstrap.Modal(element);
        modal.show();
    }
  }
}
