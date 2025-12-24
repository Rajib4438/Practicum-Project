import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-forgotpass',
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.css',
  standalone: true
})
export class Forgotpass {
email: any;
successMessage: any;
errorMessage: any;

constructor(private http: HttpClient,private router:Router) {}

  sendResetLink(): void {

    if (!this.email) {
      this.errorMessage = 'Email is required';
      return;
    }

    this.http.post(
      'https://localhost:7290/api/user/forgot-password',
      { email: this.email }
    ).subscribe((data:any)=>{
       this.router.navigate(['login']);
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })
  }

}
