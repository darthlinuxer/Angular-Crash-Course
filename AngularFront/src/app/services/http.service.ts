import { Injectable } from '@angular/core';
import { Observable, map, throwError, pipe, firstValueFrom } from 'rxjs';
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

  public async get<T>(route: string): Promise<T> {
    try{
      const result = await firstValueFrom(this.client.get<T>(`${this.apiUrl}/${route}`));
      return result;
    }catch (error:any){
      throw new Error(error);
    }
    
  }

  public async getwithId<T>(route: string, id: string): Promise<T|undefined> {
    try {
      const data = await this.client.get<T>(`${this.apiUrl}/${route}/${id}`).toPromise();
      console.log("Data received:", data);
      return data;
    } catch (error:any) {
      // Handle error
      throw new Error(error);
    }
  }

  public async delete(route: string, id: string):Promise<any> {
    let fullroute = `${this.apiUrl}/${route}/${id}`;
    console.log("Delete fullroute: ", fullroute);
    var result = await firstValueFrom(this.client.delete(fullroute, { headers: this.headers }));
    return result;
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

  public async create<T>(route: string, element: T): Promise<Object> {
    try{
      const response = await firstValueFrom(this.client.post(`${this.apiUrl}/${route}`, element, { headers: this.headers }));
      return response;
    } catch (error:any){
      throw new Error(error);
    }
    
  }
}