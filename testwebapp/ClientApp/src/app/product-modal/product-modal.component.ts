import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProductAction, UpdateProductAction } from '../action/product-action';
import { Store } from '@ngrx/store';
import { getProducts, RootReducerState } from '../reducer';
import { nonNegativeValidator } from '../validators/customformvalidator';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {
  @Input() product: product = { productName: '',  type: ''};
  @Input() isEdit: boolean = false; // Flag to indicate edit mode
  @Output() productSaved = new EventEmitter<void>();
  products : product[] = [];
  toastr = inject(ToastrService);

  productForm: FormGroup;

  constructor(private fb: FormBuilder,private productService: ProductService,private store:Store<RootReducerState>) {
    this.productForm = this.fb.group({
      id:[''],
      productName: ['', Validators.required],
      type: [null, [Validators.required]],
      price: ['', [Validators.required,Validators.min(1)]],
      quantity: ['',[Validators.required,Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.store.select(getProducts).subscribe((data)=>{
      this.products = data;
    })
  }

  ngOnChanges() {
    if (this.isEdit) {
      this.productForm.patchValue(this.product); // Populate form with user data for editing
    } else {
      this.productForm.reset(); // Reset form for adding new user
    }
  }



  saveProduct() {
    debugger
    if (this.productForm.valid) {
        if (this.isEdit) {
          // Update logic here
          var productWithSameName = this.products.some(x=>x.productName==this.productForm.value.productName&&x.id!=this.productForm.value.id);
          if(productWithSameName){
            this.toastr.info("Product with same name exists!","info");
            return;
          }
          console.log('Updating user:', this.productForm.value);
          this.productService.updateProduct(this.productForm.value).subscribe({
            next: (response) => {
              // Check the status code
              if (response.status === 200) {
                console.log('User updated successfully successfully');
                this.toastr.success("Product updated successfully","success");
                this.store.dispatch(new UpdateProductAction(this.productForm.value));
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
          var productWithSameName = this.products.some(x=>x.productName==this.productForm.value.productName);
          if(productWithSameName){
            this.toastr.info("Product with same name exists!","info");
            return;
          }
          // Add logic here
          console.log('Adding new user:', this.productForm.value);
          this.productForm.value.id = "";
          this.productService.saveProduct(this.productForm.value).subscribe({
            next: (response) => {
              // Check the status code
              if (response.status === 200) {
                console.log('User added successfully');
                this.toastr.success("Product added successfully","success");
                this.store.dispatch(new AddProductAction(this.productForm.value));
                this.productSaved.emit();
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
      this.productForm.markAllAsTouched();
    }

  }

  private closeModal() {
    const modal = document.getElementById('addProductModal');
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
