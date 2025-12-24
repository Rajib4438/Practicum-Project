import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class Registration {

registerData = {
    registerAs: '',
    fullName: '',
    email: '',
    phone: '',
    userName: '',
    password: '',
    gender: '',
    isApproved: false
  };
  constructor(private http:HttpClient,private router:Router) {}
submit(){
    this.http.post('https://localhost:7290/api/UserRegistration/register',this.registerData).subscribe((data:any)=>{
       this.router.navigate(['login']);
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })
}
}
