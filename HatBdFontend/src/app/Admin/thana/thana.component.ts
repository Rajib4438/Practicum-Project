import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Fixed: Import CommonModule
import { FormsModule } from '@angular/forms';     // Fixed: Import FormsModule

@Component({
  selector: 'app-thana',
  standalone: true, // Angular 17 Standard
  imports: [CommonModule, FormsModule], // Fixed: Add Imports here
  templateUrl: './thana.component.html',
  styleUrls: ['./thana.component.css']
})
export class ThanaComponent implements OnInit {

  districts: any[] = [];
  selectedDistrictId: number | null = null;

  thanas: any[] = [];
  newThanaName: string = '';

  // Direct API URLs
  private apiUrlDistrictGet = 'https://localhost:7290/api/District/Get';
  private apiUrlThanaGetAll = 'https://localhost:7290/api/Thana/GetAll';
  private apiUrlThanaInsert = 'https://localhost:7290/api/Thana/Insert';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDistricts();
  }

  loadDistricts() {
    this.http.get<any[]>(this.apiUrlDistrictGet).subscribe({
      next: res => this.districts = res,
      error: err => console.error('Error loading districts', err)
    });
  }

  onDistrictChange() {
    this.thanas = []; // Reset list first
    
    if (this.selectedDistrictId != null) {
      this.http.get<any[]>(this.apiUrlThanaGetAll).subscribe({
        next: res => {
          // filter thanas by selected district
          // [ngValue] ব্যবহার করায় এখন টাইপ ঠিক থাকবে (Number === Number)
          this.thanas = res.filter(t => t.districtId === this.selectedDistrictId);
        },
        error: err => console.error('Error loading thanas', err)
      });
    }
  }

  addThana() {
    if (!this.newThanaName.trim() || this.selectedDistrictId == null) {
      alert('Please enter thana name and select district');
      return;
    }

    const payload = {
      ThanaName: this.newThanaName,
      DistrictId: this.selectedDistrictId
    };

    this.http.post(this.apiUrlThanaInsert, payload).subscribe({
      next: res => {
        alert('Thana added successfully');
        this.newThanaName = '';
        this.onDistrictChange(); // reload thanas for the current district
      },
      error: err => console.error('Error adding thana', err)
    });
  }
}