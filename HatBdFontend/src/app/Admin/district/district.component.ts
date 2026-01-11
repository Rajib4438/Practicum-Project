import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Fixed: for *ngFor
import { FormsModule } from '@angular/forms';     // Fixed: for [(ngModel)]

@Component({
  selector: 'app-district',
  standalone: true, // Angular 17 Recommended
  imports: [CommonModule, FormsModule], // Fixed: Import modules here
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {

  districts: any[] = [];
  newDistrictName: string = '';

  // API URL
  private apiUrlGet = 'https://localhost:7290/api/District/Get';
  private apiUrlInsert = 'https://localhost:7290/api/District/Add';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDistricts();
  }

  loadDistricts() {
    this.http.get<any[]>(this.apiUrlGet).subscribe({
      next: (res) => this.districts = res,
      error: (err) => console.error('Error loading districts', err)
    });
  }

  addDistrict() {
    if (!this.newDistrictName.trim()) {
      alert('Please enter district name');
      return;
    }

    const payload = { DistrictName: this.newDistrictName };

    this.http.post(this.apiUrlInsert, payload).subscribe({
      next: (res) => {
        alert('District added successfully');
        this.newDistrictName = '';
        this.loadDistricts(); // reload the list
      },
      error: (err) => console.error('Error adding district', err)
    });
  }
}