import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, pipe } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = 'http://localhost:5185/api';
  // The HTTP options for the requests
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private client: HttpClient) { }

  public get<T>(route: string): Observable<T> {
    return this.client.get<T>(`${this.apiUrl}/${route}`).pipe
      (
        map(data => {
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

  public getwithId<T>(route: string, id: string): Observable<T> {
    return this.client.get<T>(`${this.apiUrl}/${route}/${id}`).pipe
      (
        map(data => {
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

  public delete(route: string, id: string) {
    let fullroute = `${this.apiUrl}/${route}/${id}`;
    console.log("Delete fullroute: ", fullroute);
    this.client.delete(fullroute, {headers: this.headers});
  }

  public update<T>(route: string, element: T, id: string) {
    let fullroute = `${this.apiUrl}/${route}/${id}`;
    console.log("Delete fullroute: ", fullroute);
    this.client.put(fullroute, element, { observe: 'response' }).pipe(
      map<HttpResponse<Object>, HttpResponse<Object>>((response: HttpResponse<Object>) => {
        if (response.status == 200) {
          console.log(`route ${route} with Id:${id} updated successful`);
        }
        return response;
      })
    );
  }

  public create<T>(route: string, element: T): Observable<Object> {
    return this.client.post(`${this.apiUrl}/${route}`, element, { headers: this.headers });
  }
}