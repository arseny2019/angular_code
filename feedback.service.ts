import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class FeedbackService {
  constructor(private http: HttpClient) {
  }

  sendFormData(data: FormData, files: File[]): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'phone') {
        formData.set(key, '+7' + data[key]);
      } else {
        formData.set(key, data[key]);
      }
    });
    files.forEach(file => {
      formData.append('fileUpload', file);
    });
    return this.http.post(environment.dataBaseUrl + '/contacts/feedback', formData);
  }
}
