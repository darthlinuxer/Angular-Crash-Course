import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, pipe } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  private apiUrl = 'http://localhost:5185/api';
   // The HTTP options for the requests
   private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private client: HttpClient) { }

  public get<T>(route:string):Observable<T>
  {
    return this.client.get<T>(`${this.apiUrl}/${route}`).pipe
    (
      map(data=>{
        console.log("Data received:", data);
        return data
      }
        ),
      catchError(error => {
        // handle error
        return throwError(() => new Error(error));
      })
    );
  }
}

