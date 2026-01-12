import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  districts: any[] = [];
  selectedDistrictId: number | null = null;

  thanas: any[] = [];
  selectedThanaId: number | null = null;

  areas: any[] = [];
  allAreas: any[] = [];

  newAreaName: string = '';

  // 🔹 edit state
  editingAreaId: number | null = null;
  editAreaName: string = '';

  private apiUrlDistrictGet = 'https://localhost:7290/api/District/Get';
  private apiUrlThanaGetAll = 'https://localhost:7290/api/Thana/GetAll';
  private apiUrlAreaGetAll = 'https://localhost:7290/api/Area/GetAll';
  private apiUrlAreaInsert = 'https://localhost:7290/api/Area/Insert';
  private apiUrlAreaUpdate = 'https://localhost:7290/api/Area/Update';
  private apiUrlAreaDelete = 'https://localhost:7290/api/Area/Delete';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDistricts();
    this.loadAllAreas();
  }

  loadDistricts() {
    this.http.get<any[]>(this.apiUrlDistrictGet).subscribe({
      next: res => this.districts = res,
      error: err => console.error(err)
    });
  }

  loadAllAreas() {
    this.http.get<any[]>(this.apiUrlAreaGetAll).subscribe({
      next: res => this.allAreas = res,
      error: err => console.error(err)
    });
  }

  onDistrictChange() {
    this.selectedThanaId = null;
    this.areas = [];
    this.thanas = [];

    if (this.selectedDistrictId) {
      this.http.get<any[]>(this.apiUrlThanaGetAll).subscribe({
        next: res => {
          this.thanas = res.filter(
            t => t.DistrictId === Number(this.selectedDistrictId)
          );
        }
      });
    }
  }

  onThanaChange() {
    this.areas = [];

    if (this.selectedThanaId) {
      this.http.get<any[]>(this.apiUrlAreaGetAll).subscribe({
        next: res => {
          const thanaName =
            this.thanas.find(t => t.ThanaId === this.selectedThanaId)?.ThanaName;

          this.areas = res.filter(a => a.thanaName === thanaName);
        }
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
      next: () => {
        alert('Area added successfully');
        this.newAreaName = '';
        this.onThanaChange();
        this.loadAllAreas();
      }
    });
  }

  // 🔹 EDIT
  startEdit(area: any) {
    this.editingAreaId = area.areaId;
    this.editAreaName = area.areaName;
  }

  cancelEdit() {
    this.editingAreaId = null;
    this.editAreaName = '';
  }

  updateArea(area: any) {
    if (!this.editAreaName.trim()) {
      alert('Area name required');
      return;
    }

    const payload = {
      AreaId: area.areaId,
      AreaName: this.editAreaName
    };

    this.http.put(this.apiUrlAreaUpdate, payload).subscribe({
      next: () => {
        alert('Area updated');
        this.cancelEdit();
        this.loadAllAreas();
        this.onThanaChange();
      }
    });
  }

  // 🔹 DELETE
  deleteArea(areaId: number) {
    if (!confirm('Are you sure you want to delete this area?')) return;

    this.http.delete(`${this.apiUrlAreaDelete}/${areaId}`).subscribe({
      next: () => {
        alert('Area deleted');
        this.loadAllAreas();
        this.onThanaChange();
      }
    });
  }
}
