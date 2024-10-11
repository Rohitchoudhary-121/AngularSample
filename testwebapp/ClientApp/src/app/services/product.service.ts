import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { product } from "../models/product";


@Injectable({
    providedIn: 'root'
  })
export class ProductService{
    private _baseUrl: string;
  private rootController: string;
  
  private header = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*'
  });

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
    this.rootController = `${this._baseUrl}api/Product`;
  }

  getAllProducts(): Observable<product[]> {
    return this.http.get<product[]>(this.rootController, { headers: this.header });
  }

  saveProduct(data:product):Observable<any>{
    return this.http.post(this.rootController, data,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }  

  deleteProduct(id:string):Observable<any>{
    return this.http.delete(`${this.rootController}/${id}`,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(data:product):Observable<any>{
    return this.http.put(this.rootController, data,{ observe: 'response' }) // Observe the full response
    .pipe(
      catchError(this.handleError)
    );
  }  

  
  private handleError(error: HttpErrorResponse) {
    // Handle the error here
    return throwError(error);
  }
}