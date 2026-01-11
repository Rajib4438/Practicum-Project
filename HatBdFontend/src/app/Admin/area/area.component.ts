import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [CommonModule, FormsModule], // Router মডিউলগুলো না লাগলে বাদ দিতে পারেন, তবে থাকলে সমস্যা নেই
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  districts: any[] = [];
  selectedDistrictId: number | null = null;

  thanas: any[] = [];
  selectedThanaId: number | null = null;

  areas: any[] = [];
  newAreaName: string = '';

  // Direct API URLs
  private apiUrlDistrictGet = 'https://localhost:7290/api/District/Get';
  private apiUrlThanaGetAll = 'https://localhost:7290/api/Thana/GetAll';
  private apiUrlAreaGetAll = 'https://localhost:7290/api/Area/GetAll';
  private apiUrlAreaInsert = 'https://localhost:7290/api/Area/Insert';

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
    // রিসেট সিলেকশন
    this.selectedThanaId = null;
    this.areas = [];
    this.thanas = [];

    if (this.selectedDistrictId) {
      this.http.get<any[]>(this.apiUrlThanaGetAll).subscribe({
        next: res => {
          debugger;
          // [ngValue] ব্যবহার করায় এখন টাইপ ঠিক থাকবে (Number === Number)
          this.thanas = res.filter(t => t.districtId === Number(this.selectedDistrictId));
        },
        error: err => console.error('Error loading thanas', err)
      });
    }
  }

  onThanaChange() {
    this.areas = []; // রিসেট এরিয়া লিস্ট

    if (this.selectedThanaId) {
      this.http.get<any[]>(this.apiUrlAreaGetAll).subscribe({
        next: res => {
          this.areas = res.filter(a => a.thanaId === this.selectedThanaId);
        },
        error: err => console.error('Error loading areas', err)
      });
    }
  }

  addArea() {
    if (!this.newAreaName.trim() || this.selectedThanaId == null) {
      alert('Please enter area name and select thana');
      return;
    }

    const payload = {
      AreaName: this.newAreaName,
      ThanaId: this.selectedThanaId
    };

    this.http.post(this.apiUrlAreaInsert, payload).subscribe({
      next: res => {
        alert('Area added successfully');
        this.newAreaName = '';
        this.onThanaChange(); // reload areas specifically for this thana
      },
      error: err => console.error('Error adding area', err)
    });
  }
}