import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Base URL for the API
  private baseUrl = 'https://jsonplaceholder.typicode.com'; // Example API URL
  constructor(private http: HttpClient) {}
  // Get all posts
  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts`).pipe(
      retry(3), // Retry up to 3 times before failing
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }

  // Get a single post by ID
  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${id}`);
  }
  // Create a new post
  createPost(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts`, post);
  }
  // Update a post
  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/posts/${id}`, post);
  }
  // Delete a post
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }
}
