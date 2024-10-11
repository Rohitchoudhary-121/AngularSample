import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { user } from '../models/user';
import { loginuser } from '../models/loginuser';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _baseUrl: string;
  private rootController: string;
  
  private header = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*'
  });

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
    this.rootController = `${this._baseUrl}api/User`;
  }

  getAllUsers(): Observable<user[]> {
    return this.http.get<user[]>(this.rootController, { headers: this.header });
  }

  saveUser(data:user):Observable<any>{
    return this.http.post(this.rootController, data,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }  

  deleteUser(id:string):Observable<any>{
    return this.http.delete(`${this.rootController}/${id}`,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }

  updateUser(data:user):Observable<any>{
    return this.http.put(this.rootController, data,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }  

  loginUser(data:loginuser):Observable<any>{
    return this.http.post(`${this._baseUrl}api/User/Login`, data,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    // Handle the error here
    return throwError(error);
  }
}
