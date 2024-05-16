import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  // Dependency Injection
  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute){
  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['',Validators.required],
      checkOutDate: ['',Validators.required],
      guestName: ['',Validators.required],
      guestEmail: ['',Validators.required, Validators.email],
      roomNumber: ['',Validators.required],
    })

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.reservationService.getReservation(id).subscribe(reservation => {
        if(reservation){
          this.reservationForm.get('checkInDate')?.patchValue(reservation.checkInDate);
          this.reservationForm.get('checkOutDate')?.patchValue(reservation.checkOutDate);
          this.reservationForm.get('guestName')?.patchValue(reservation.guestName);
          this.reservationForm.get('guestEmail')?.patchValue(reservation.guestEmail);
          this.reservationForm.get('roomNumber')?.patchValue(reservation.roomNumber);
        }
      })
      }
  }

  reservationForm: FormGroup = new FormGroup({});

  onSubmit(){
    if(this.reservationForm){

      let newReservation: Reservation = this.reservationForm.value;

      let id = this.activatedRoute.snapshot.paramMap.get('id');

      if(id){
        //Update
        this.reservationService.updateReservation(id, newReservation);
      }
        else{
          this.reservationService.addReservation(newReservation);
        }
    }
      
      this.router.navigate(['/list'])
    }
  }