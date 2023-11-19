import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {
  isLogend:boolean=false;
  email:any;
  custID:any;
  custName:any;

  constructor()
  {
   if(localStorage.getItem('email'))
   {
    this.isLogend=true;
    this.email=localStorage.getItem('email');
    this.custID=localStorage.getItem('customerId')
    this.custName=localStorage.getItem('custName')
   }
  }
  userDbItems:any[] =[
    {
      Link:'/my_profile',
      Icon:'icon-user',
      Title:'My Profile',
      LinkName:'View / Edit Profile'
    },
    {
      Link:'/orders',
      Icon:'icon-gift-box',
      Title:'My Orders',
      LinkName:'Track Orders, Returns, Buy Thing Again'
    },
    {
      Icon:'icon-circular-alarm-clock-tool',
      Title:'My Reminders',
      LinkName:'Add / Edit / Delete Reminder'
    },
    {
      Link:'/user-address',
      Icon:'icon-pin',
      Title:'My Address',
      LinkName:'Add / View / Edit Address'
    },
    {
      Link:'/user-change-password',
      Icon:'icon-lock',
      Title:'Change Password',
      LinkName:'Change your Password'
    },
    {
      Link:'/user-vouchers',
      Icon:'icon-coupon',
      Title:'Vouchers',
      LinkName:'Used / Unused Gift Vouchers'
    },
  ]
}
