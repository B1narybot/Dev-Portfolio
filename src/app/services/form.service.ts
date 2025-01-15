import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { result } from 'cypress/types/lodash';

@Injectable({
  providedIn: 'root',
})
export class FormService implements   OnInit{
  private apiUrl = 'https://general-2-cf5a76d71d7e.herokuapp.com/submitForm';

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.ping()
  }
  async ping(){
    const res = await this.http.get(this.apiUrl).toPromise();
    console.log(res?.toString());
    return res
  }
  submitForm(formData: { name: string; email: string; text: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, formData, { headers });
  }
}
