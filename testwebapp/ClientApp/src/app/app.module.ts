import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { UserService } from './services/user.service';
import { UserComponent } from './user/user.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducer';
import { RegisterUserComponent } from './register-user/register-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginUserComponent } from './login-user/login-user.component';
import { AuthGuard } from './auth.guard';
import { ProductComponent } from './product/product.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    UserComponent,
    UserModalComponent,
    RegisterUserComponent,
    LoginUserComponent,
    ProductComponent,
    ProductModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    StoreModule.forRoot(rootReducer),
    HttpClientModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'user', component: UserComponent,canActivate: [AuthGuard]  },
      { path: '', component: ProductComponent,canActivate: [AuthGuard]  },
      { path: 'register', component: RegisterUserComponent },
      { path: 'login', component: LoginUserComponent },
    ]),
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
