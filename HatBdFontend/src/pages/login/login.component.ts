import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class Login {
  data: any = {
    userName: '',
    password: ''
  };

  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if(!this.data.userName || !this.data.password){
      alert('Please fill all fields');
      return;
    }

    this.isLoading = true;

    this.http.post('https://localhost:7290/api/UserRegistration/login', this.data)
      .subscribe(
        (response: any) => {
          // টোকেন এবং ইউজারের নাম সেভ করা হচ্ছে [cite: 71, 115]
          localStorage.setItem('userToken', response.token);
          // আপনার API যদি response.userName না পাঠায়, তবে ইনপুট ফিল্ডের নাম সেভ হবে
          localStorage.setItem('userName', response.userName || this.data.userName); 
          debugger
          if (response.registerAs == 'Admin') {
            this.router.navigate(['/layout']).then(() => {
              window.location.reload(); 
            });
            return;

          }

          
          // সফল হলে সরাসরি হোম পেজে রিডাইরেক্ট [cite: 50, 119]
          this.router.navigate(['/']).then(() => {
            window.location.reload(); 
          });
        },
        (err: HttpErrorResponse) => {
          alert('Login Failed! Invalid credentials.');
          this.isLoading = false;
        }
      );
  }

  onforget_password(){
    this.router.navigate(['forgotpass']);
  }
}