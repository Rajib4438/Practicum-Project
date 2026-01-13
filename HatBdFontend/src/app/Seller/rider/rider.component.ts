import { Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
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
    debugger
    if(!this.selectedDistrict) return;
    this.http.get(this.baseUrl + "Thana/GetAll")
      .subscribe((res: any) => {
        this.thanas = res.filter((t:any) => t.DistrictId === Number(this.selectedDistrict));
        debugger
        this.areas = [];
      });


      
    }
  

  onThanaChange() {
          this.areas = [];

    if (this.selectedThana) {
      this.http.get<any[]>(this.baseUrl + "Area/GetAll").subscribe({
        next: res => {
          debugger;
          this.areas = res.filter(a => a.thanaId === Number(this.selectedThana));
        }
      });
    }
  }

  addRider() {
    if(!this.riderName || !this.riderPhone || !this.selectedDistrict || !this.selectedThana || !this.selectedArea) {
      alert("All fields are required!");
      return;
    }

    const data = {
      name: this.riderName,
      phone: this.riderPhone,
      email: this.riderEmail,
      districtId: this.selectedDistrict,
      thanaId: this.selectedThana,
      areaId: this.selectedArea
    };

    this.http.post(this.baseUrl + "Rider/Add", data)
      .subscribe(() => {
        this.loadRiders();
        this.resetForm();
      });
  }

  loadRiders() {
    this.http.get(this.baseUrl + "Rider/List")
      .subscribe((res: any) => {
        this.riderList = res;
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
    this.http.delete(this.baseUrl + "Rider/Delete/" + id)
      .subscribe(() => {
        this.loadRiders();
      });
  }

}
