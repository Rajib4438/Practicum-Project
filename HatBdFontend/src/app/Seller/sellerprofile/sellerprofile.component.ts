import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, FormsModule],
  templateUrl: './sellerprofile.component.html',
  styleUrls: ['./sellerprofile.component.css']
})
export class SellerProfileComponent implements OnInit {

  user: any = null;
  loading = true;
  isEditing = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

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

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateProfile() {
    if (!this.user) return;

    this.http.put(`https://localhost:7290/api/UserRegistration/update/${this.user.id}`, this.user)
      .subscribe({
        next: (res: any) => {
          alert('Profile Updated Successfully!');
          this.isEditing = false;
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update profile');
        }
      });
  }
}
