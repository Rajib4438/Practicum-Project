import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './sellerprofile.component.html',
  styleUrls: ['./sellerprofile.component.css']
})
export class SellerProfileComponent implements OnInit {

  user: any = null;
  loading = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User not logged in');
      return;
    }

    this.http.get(`https://localhost:7290/api/UserRegistration/profile/${userId}`)
      .subscribe({
        next: (res) => {
          this.user = res;
          this.cdr.detectChanges();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }
}
