import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CurdService } from 'src/app/services/curd.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartCount: number = 0;
  PinNumber: number = 500090;
  sessionId: any;
  city: any;
  countryname: any;
  currency: any;
  cartItems: any = [];
  userIp: any;
  addonproducts: any;
  firstlistItem: any;
  customerId: any = 0;
  viewedProducts: any = [];
  loader:boolean=true;
  cityName: string | null;
  coutryName: string | null;
  currencySelected: string | null;
  outofdatemessage: boolean = false;
  MinCartMessage: any;
  currencyClass: any;
  deliveryDates_array: any;
  displaydeliveryDate: any;
  displaydeliveryTime: any;
  deliveryTime: any;
  userForm: any;
  selectedFile: any;
  maxLeadTime:any;
  showcheckoutbtn:boolean=false;
  customimg:any;
  @ViewChild('closeButton')
  closeButton!: ElementRef;
  timeerror:boolean=false;
  dateerror:boolean=false;
incrementbtn:boolean=false;
decrementbtn:boolean=false
    productId: any;

  constructor(private titleService:Title, private meta:Meta,private fb: FormBuilder, private renderer: Renderer2, private route: Router, private toastr: ToastrService, private _crud: CurdService, private cookieService: CookieService) {

    this.titleService.setTitle("Country Oven Cart | countryoven.com");
    this.meta.updateTag({ name: 'description',  content: 'Find best cakes, gifts, flowers. Florist shop in Faq with same day delivery Online and experss delivery.Shop Now!' });
    this.meta.updateTag({ name: 'keywords',  content: 'best cakes, gifts, flowers,gifts Online, flowers online,Cakes Online,cookies,Cookies Online' });
    this.meta.updateTag({ name: 'classification',  content: 'Country Oven' });
  


    this.sessionId = this.cookieService.get('sessionID')
    this.city = localStorage.getItem('city')
    this.countryname = localStorage.getItem('country');
    this.currency = localStorage.getItem('currency');

    this.currency = localStorage.getItem('currency');
    
    if (this.currency == 'INR') {
      this.currencyClass = 'icon-inr'
    }
    else if (this.currency == 'USD') {
      this.currencyClass = 'icon-dollar-currency-symbol'
    }



    if (localStorage.getItem('customerId')) {
      this.customerId = localStorage.getItem('customerId')
    }
    this.getCarts();
    this.cityName = localStorage.getItem('city')
    this.coutryName = localStorage.getItem('country');
    this.currencySelected = localStorage.getItem('currency');

    function increaseValue(): void {
      const inputElement = document.getElementById('number') as HTMLInputElement;
      let value: number = parseInt(inputElement.value, 10);
      value = isNaN(value) ? 0 : value;
      value++;
      inputElement.value = value.toString();
    }
    function decreaseValue(): void {
      const inputElement = document.getElementById('number') as HTMLInputElement;
      let value: number = parseInt(inputElement.value, 10);
      value = isNaN(value) ? 0 : value;
      value = value < 1 ? 1 : value;
      value--;
      inputElement.value = value.toString();
    }

    this.userForm = this.fb.group({

      deliveryDate: ['', Validators.required],
      deliveryTime: ['', Validators.required],


    });


  }
  ngOnInit(): void {
    this.addLoader();
    this._crud.getIpAddress().subscribe((data: any) => {
      this.userIp = data.ip;
    });
    this.getViewedProducts();

  }



  getbindDate() {
    let data = {
      "cityName": this.city,
      "maxLeadTime": this.maxLeadTime
    }

    this._crud.getBindDeliveryDates(data).subscribe(res => {
      
      this.deliveryDates_array = res

      setTimeout(() => {
        
        this.userForm.get('deliveryDate')?.setValue(this.displaydeliveryDate);


        const data = {
          // "DeliveryDate": this.deliveryDates_array[0].deliveryDateValue,
          "DeliveryDate":this.displaydeliveryDate,
          "Leadtime": 0,
          "ZipCode": 1235,
          "InstantDelivery": false,
          "cityName": this.cityName,
          "productId": this.productId,
          "sessionId": this.cookieService.get('sessionID')
        }
        this._crud.getBindDeliveryTimes(data).subscribe(res => {

          this.deliveryTime = res.deliveryTimingsDtos;
          setTimeout(() => {
            
            // this.userForm.get('deliveryTime')?.setValue(this.displaydeliveryTime)
          }, 100);
        
        })
      }, 100);
    });
  }

  getBindDeliveryTimes(e: any) {
    const selectedValue = (e.target as HTMLSelectElement).value;

    const data = {
      "DeliveryDate": selectedValue,
      "Leadtime": 0,
      "ZipCode": 1235,
      "InstantDelivery": false,
      "cityName": this.cityName,
      "productId": this.productId,
      "sessionId": this.cookieService.get('sessionID')
    }
    this._crud.getBindDeliveryTimes(data).subscribe(res => {

      this.deliveryTime = res.deliveryTimingsDtos;

    })
  }


  updateDateandtime() {
    
        if(this.userForm.get('deliveryTime').value.toString() !=""  && this.userForm.get('deliveryTime').value.toString() !='Select Time')
        {
          this.timeerror=false;
          
          let data = {
            "sessionId": this.sessionId,
            "deliveryDate": this.userForm.get('deliveryDate').value,
            "deliveryTime": this.userForm.get('deliveryTime').value.toString(),
          }
      
          this._crud.updateDeliveryDateTime(data).subscribe(res => {
            if (!res.isEroor) {
              this.userForm.get('deliveryTime')?.setValue(this.displaydeliveryTime)
            //  this.userForm.get('deliveryTime')?.setValue(this.displaydeliveryTime)
              this.getCarts()
              const button: HTMLButtonElement = this.closeButton.nativeElement;
              button.click();
            }
            
      
          })
        }
    
        else
        {
          this.timeerror=true;
        }
        
    
      }

      openDatetime()
      {
        this.userForm.get('deliveryTime')?.setValue('')
        this.getbindDate();

      }
  getCarts() {
    let data = {
      customerId: this.customerId,
      sessionId: this.sessionId,
      cityName: this.city,
      countryName: this.countryname,
      currencySelected: this.currency
    }

    this._crud.postShopingCart(data).subscribe(res => {
      this.loader=false;
      this.removeLoader();
      
      this.cartItems = res;
      this.cartCount = res.length;

      this._crud.updateHeaderData(this.cartCount);

      this.firstlistItem = this.cartItems[0];
      
      this.displaydeliveryDate = this.firstlistItem.deliveryDate;
      this.displaydeliveryTime = this.firstlistItem.deliveryTiming;
      this.maxLeadTime = this.firstlistItem.maxLeadTime;
      this.MinCartMessage = "";
      if (this.currencySelected == 'INR') {
        if (this.firstlistItem?.totalAmount <= 250) {
          this.outofdatemessage = true;
          this.MinCartMessage = "Minimum Cart Value is 250";
        }
        else {
          this.outofdatemessage = this.cartItems.some((item: { outOfDateMessage: any; }) => item.outOfDateMessage);
        }
      }
      else
      {
        if (this.firstlistItem?.totalAmount <= 250/80) {
          this.outofdatemessage = true;
          this.MinCartMessage = "Minimum Cart Value is 3$";
        }
        else {
          this.outofdatemessage = this.cartItems.some((item: { outOfDateMessage: any; }) => item.outOfDateMessage);
        }
      }
    
      this.getbindDate();
    });
  }


  incrementQuantity(index: number, sno: any) {
    this.incrementbtn=true;
    this.cartItems[index].quantity++;
    let quntity= this.cartItems[index].quantity
    this.updateCartItem(sno,quntity,index,'i')
  }

  decrementQuantity(index: number,sno: any) {
    if (this.cartItems[index].quantity > 0) {
      this.cartItems[index].quantity--;
      let quntity= this.cartItems[index].quantity
this.updateCartItem(sno,quntity, index, 'd')

    }
  }




  updateCartItem(sno: any, quntity: any, index:any, status:any) {

    let data = {
      "sno": sno,
      "Quantity": quntity
    }
    this.addLoader();
    this._crud.updateQuantity(data).subscribe(res => {
      this.removeLoader();
      this.incrementbtn = false;
      if (!res.isEroor) {

        this.getCarts();
        this.cartItems[index].errmsg = "";
      }
      else
      {
        this.cartItems[index].errmsg = res.errorMessage;
if(status =='i')
  {
    this.cartItems[index].quantity--;
  }
      }
    });
  }





  DeleteCartItem(sno: any) {

    Swal.fire({
      width: '350px',
      // imageUrl: '../../assets/images/tick.png',
      imageHeight: 80,
      text: 'Do you want to delete the item',
      showCancelButton: true,
      confirmButtonText: 'Okay'
    }).then((result) => {
      if (result.isConfirmed) {

        let data = {
          "sno": sno
        }

        this._crud.deleteProduct(data).subscribe(res => {

          this.getCarts();
        });
      }
    });


  }




  addLoader() {
    this.renderer.addClass(document.body, 'bodyloader');
  }
  removeLoader() {
    this.renderer.removeClass(document.body, 'bodyloader');
  }

  addOnProducts(flag:any) {
if(flag=='0')
{
  this.showcheckoutbtn=true;
}
    let data = {
      customerId: this.customerId,
      sessionId: this.sessionId,
      cityName: this.city,
      countryName: this.countryname,
      currencySelected: this.currency
    }

    this._crud.postAddOn(data).subscribe(res => {

      this.addonproducts = res
    });
  }



  addOnProductsupdateCart(addOnProductId: any) {

    let data = {
      "customerId": this.customerId,
      "sessionId": this.sessionId,
      "addOnProductId": addOnProductId,
      "cityName": this.city,
      "deliveryDate": this.firstlistItem.deliveryDate,
      "deliveryTime": this.firstlistItem.deliveryTiming
    }

    this._crud.addAddOn(data).subscribe(res => {

      if (res.isEroor) {

        this.toastr.error(res.errorMessage);
      }
      else {
        this.toastr.success(res.successMessage);
        this.getCarts();
      }
    });
  }




  /* checkout */



  SaveOrderDetails(addOnProductId: any) {

    let data = {

      "orderDetailsDto": {
        "walletAmount": 0,
        "isCustomGift": true,
        "cityName": this.city,
        "customerId": this.customerId,
        "addressId": 262699,
        "totalAmount": 2500,
        "deliveryDate": "2023-10-10T06:01:54.302Z",
        "couponCode": "",
        "discountAmount": 0,
        "country": this.countryname,
        "deliveryTime": "Sameday",
        "deliveryCharges": 0,
        "customerComments": "Please deliver before 4PM",
        "giftingCard": "",
        "sessionId": this.sessionId,
        "customerIPAddress": this.userIp
      }

    }

    this._crud.SaveOrderDetails(data).subscribe(res => {


    });
  }


  gotocheckout() {
    if (this.customerId) {
      this.route.navigateByUrl('/checkout')
    }
    else {
      this.route.navigateByUrl('/login?arg=ck')
    }

  }




  //getRelatedProducts
  getViewedProducts(): void {
    const data = {


      "productId": "",
      "cityName": this.cityName,
      "countryName": this.coutryName,
      "currencySelected": this.currencySelected,
      "sessionId": this.sessionId

    }
    this._crud.getViewedProducts(data).subscribe(res => {

      this.viewedProducts = res;


    })
  }

 
  capturephoto(src:any)
  {
    this.customimg=src;
    
  }
}
