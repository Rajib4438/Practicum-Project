import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-thana',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './thana.component.html',
  styleUrls: ['./thana.component.css']
})
export class ThanaComponent implements OnInit {

  districts: any[] = [];
  selectedDistrictId: number | null = null;

  thanas: any[] = [];
  newThanaName: string = '';
allThanas: any[] = [];
  // Direct API URLs
  private apiUrlDistrictGet = 'https://localhost:7290/api/District/Get';
  private apiUrlThanaGetAll = 'https://localhost:7290/api/Thana/GetAll';
  private apiUrlThanaInsert = 'https://localhost:7290/api/Thana/Insert';

  constructor(private http: HttpClient,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadDistricts();
    this.getAllThanas();
  }
getAllThanas(){
    this.http.get<any[]>(this.apiUrlThanaGetAll).subscribe({
      next: res => {
        this.allThanas = res;
        this.cdr.detectChanges();

      },
      error: err => console.error('Error loading thanas', err)
    }); 
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
          // [ngValue] ব্যবহার করায় এখন টাইপ ঠিক থাকবে (Number === Number)
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
        this.onDistrictChange(); 
        this.getAllThanas();
      },
      error: err => console.error('Error adding thana', err)
    });
  }

  deleteThana(thanaId: number) {
    const apiUrlThanaDelete = `https://localhost:7290/api/Thana/Delete/${thanaId}`; 
    this.http.delete(apiUrlThanaDelete).subscribe({
      next: res => {
        alert('Thana deleted successfully');
        this.getAllThanas(); // Refresh the list of thanas
        if (this.selectedDistrictId != null) {
          this.onDistrictChange(); // Refresh the filtered list if a district is selected
        }
      },
      error: err => console.error('Error deleting thana', err)
    });
  }

  editThana(thana: any) {
    
  }
}