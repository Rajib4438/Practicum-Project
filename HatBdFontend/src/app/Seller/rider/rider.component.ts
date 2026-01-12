import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rider',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css']
})
export class RiderComponent implements OnInit {

  riders: any[] = [];
  private apiUrl = 'https://localhost:7290/api/UserRegistration/riders';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(res => {
      this.riders = res;
    });
  }
}
