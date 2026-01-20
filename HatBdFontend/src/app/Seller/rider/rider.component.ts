import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rider',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css'],
})
export class RiderComponent implements OnInit {

  riderName: string = '';
  riderPhone: string = '';
  riderEmail: string = '';

  districts: any[] = [];
  thanas: any[] = [];
  areas: any[] = [];

  selectedDistrict: any = '';
  selectedThana: any = '';
  selectedArea: any = '';

  riderList: any[] = [];

  baseUrl = "https://localhost:7290/api/";

  // 🔥 NEW (login seller id)
  sellerId: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // 🔥 SellerId auto load
    this.sellerId = Number(localStorage.getItem('userId')) || 0;

    this.loadDistrict();
    this.loadRiders();
  }

  loadDistrict() {
    this.http.get(this.baseUrl + "District/Get")
      .subscribe((res: any) => {
        this.districts = res;

      });
  }

  onDistrictChange() {
    if (!this.selectedDistrict) return;

    this.http.get(this.baseUrl + "Thana/GetAll")
      .subscribe((res: any) => {
        this.thanas = res.filter((t: any) =>
          t.DistrictId === Number(this.selectedDistrict)
        );
        this.areas = [];
      });
  }

  onThanaChange() {
    this.areas = [];

    if (this.selectedThana) {
      this.http.get<any[]>(this.baseUrl + "Area/GetAll")
        .subscribe(res => {
          this.areas = res.filter(a =>
            a.thanaId === Number(this.selectedThana)
          );
        });
    }
  }

  // ================= ADD RIDER =================
  addRider() {
    if (
      !this.riderName ||
      !this.riderPhone ||
      !this.selectedDistrict ||
      !this.selectedThana ||
      !this.selectedArea
    ) {
      alert("All fields are required!");
      return;
    }

    const data = {
      name: this.riderName,
      phone: this.riderPhone,
      email: this.riderEmail,
      sellerId: this.sellerId,       // 🔥 AUTO ASSIGN SELLER
      districtId: this.selectedDistrict,
      thanaId: this.selectedThana,
      areaId: this.selectedArea
    };
    this.http.post(this.baseUrl + "Rider/Create", data)
      .subscribe(() => {
        this.loadRiders();
        this.resetForm();
      });
  }

  loadRiders() {

    this.http.get(this.baseUrl + "Rider/GetRiderBySellerId?id=" + this.sellerId)
      .subscribe((res: any) => {
        this.riderList = res;
        console.log('Rider List:', this.riderList);
        this.cdr.detectChanges();
      });
  }

  resetForm() {
    this.riderName = '';
    this.riderPhone = '';
    this.riderEmail = '';
    this.selectedDistrict = '';
    this.selectedThana = '';
    this.selectedArea = '';
  }

  deleteRider(id: any) {
    if (!confirm("Are you sure you want to delete this rider?")) return;

    this.http.delete(this.baseUrl + "Rider/Delete/" + id)
      .subscribe({
        next: () => {
          alert("Rider deleted successfully!");
          this.loadRiders();
        },
        error: (err) => {
          console.error(err);
          alert("Failed to delete rider.");
        }
      });
  }
}
