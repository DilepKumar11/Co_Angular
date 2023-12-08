import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { CurdService } from 'src/app/services/curd.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  cityname:any;
  originalcityname:any;
  type:any;
  PageName:any;
  productData:any;
  products:any
filters:any=[]
filterswrapper:any;

currentPage: number=0;
  totalPages: number=0;
  pagesBeforeCurrent: number[] = [];
  pagesAfterCurrent: number[] = [];
  isHiddensearchFilter=false;
  metaData: any;
  typeName:any;
  breadTitle:any;
  breadcatTitle: any;
  getOldUrl:any;
  sorder:any=1;
  sortValue:any='Recommended';
  loading:boolean=true;
    filterChanged(filterOption: any): void {

const filterGroup = this.filterswrapper.find((group:any) => group.filterOptions.includes(filterOption));

if (filterGroup) {
  const selectedValuesByFilterType:any = {};
  for (const filterGroup of this.filterswrapper) {
    const selectedValues = filterGroup.filterOptions
      .filter((option:any) => option.selected)
      .map((selectedOption:any) => selectedOption.value);
  
    if (selectedValues.length > 0) {
      selectedValuesByFilterType[filterGroup.filterType] = selectedValues;
    }
  }
  console.log(selectedValuesByFilterType);
 
const fliterV="[" + selectedValuesByFilterType + "]"
this.currentPage=1;
  this.getProductDetails([selectedValuesByFilterType], this.currentPage, this.sorder);




} }
 


constructor (  private titleService: Title, private location: Location, private locationStrategy: LocationStrategy,
  private meta: Meta,private _crud:CurdService, private route:ActivatedRoute, private formBuilder: FormBuilder, private router: Router)
{
  this.originalcityname=localStorage.getItem('city')
   this.router.events.subscribe(() => {
    
 
    
    //http://localhost:4200/order/Mumbai/christmas-cakes-online
  });


}



  ngOnInit(): void {


    this.route.paramMap.subscribe((params: ParamMap) => {
         
  this.getPageRoutes();
  this.getMeta();
this.getProductDetails(this.filters, 1, this.sorder);
this.getFiltersDetails()
     
    });





  }

getnewurl(urlcity:any)
{
  this.getOldUrl= this.router.url;
  
  let newurl=  this.getOldUrl.replace(urlcity, this.cityname);
  console.log(newurl)
  this.location.replaceState(newurl);
}


  getPageRoutes() {
    this.route.params.subscribe((params) => {
      if (params['favspl']) {
        let urlparms = params['favspl'].split('-to-');
        if (urlparms.length > 1) {
          this.typeName = 'FLV';
          this.cityname = urlparms[1];
          this.cityname=this.originalcityname;
          this.PageName = this.cityname
          this.getnewurl(urlparms[1])
        }
        else {
          let urlparms1 = params['favspl'].split('-');
          this.cityname = urlparms1[urlparms1.length - 1];
          this.getnewurl(urlparms1[urlparms1.length - 1])
          this.cityname=this.originalcityname;
          this.typeName = 'SPL';
          let resultArray:any='';
          for (let i = 0; i < urlparms1.length -1; i++) {
            if(resultArray == '')
            {
              resultArray = urlparms1[i];
            }
            else
            {
              resultArray = resultArray + '-' + urlparms1[i];
            }
            
          }
          this.PageName = resultArray
        }
        
      }
      else if (params['cityname1']) {

        this.cityname = params['cityname1'];
        
        this.typeName = 'CTY';
        this.PageName = params['PageName1'];

      }
      else if (params['type']) {
        this.cityname = params['cityname'];
        this.cityname=this.originalcityname;
        this.typeName = params['type'];
        this.PageName = params['PageName'];
        this.getnewurl(params['cityname'])
      }
      else {

      }


      if (this.typeName == 'online-delivery' || this.PageName == 'online-delivery') {
        this.type = 'C';
        
      } else if (this.typeName == 'order') {
        this.type = 'SC';
        
      }
      else if (this.typeName == 'send') {
        this.type = 'OCC';
        
      }

      else if (this.typeName == 'SPL') {
        this.type = 'SPL';
        
      }

      else if (this.typeName == 'FLV') {
        this.type = 'FLV';
        
      }
      else if (this.typeName == 'search_result') {
        this.type = 'SE';
        this.cityname = params['PageName'];
        this.cityname=this.originalcityname;
        this.PageName = params['cityname'];
      }




      else {
        this.type = this.typeName;
        
      }


      // this.PageName = params['PageName'];
    });
  }

  selectedItems: any[] = [];
  



  getMeta(): void {
    // http://test.countryoven.com/api/Product/meta?cityname=Hyderabad&Type=C&PageName=cakes
    const data={
      cityname:this.cityname,
      Type:this.type,
      PageName:this.PageName
    }

    this._crud.getMeta(data).subscribe(res => {
     this.metaData=res;
      console.log(res)
      console.log(res.title)
      this.titleService.setTitle(res.title);
this.breadTitle=res.subCategoryNameCapital || res.seoSpecialPageName || res.occasionNameCapital;
this.breadcatTitle=res.categoryNameCapital || res.specialPageCapital;
      this.meta.updateTag({ name: 'description',  content: res.metaDescription });
      this.meta.updateTag({ name: 'keywords',  content: res.metaKeywords });

    })
  }


  getProductDetails(filters:any, pagenumber?:any, sortOrder?:any): void {
    this.loading=true;
    const data={
      cityname:this.cityname,
      country:'India',
      Type:this.type,
      PageName:this.PageName,
      currencySelected:'INR',
      PageNumber:pagenumber,
      PageSize:40,
      productFilters:filters,
      sortOrder:sortOrder
    }

    this._crud.getProductDetails(data).subscribe(res => {
     this.loading=false;
    this.productData=res;
    console.log(this.productData)
    console.log(this.productData.items.length)
    this.products=this.productData.items
    this.currentPage=this.productData.pageNumber;
this.totalPages=this.productData.totalPages
  })
  }

  getFiltersDetails(): void {
    
    const data={
      cityname:this.cityname,
    
      Type:this.type,
      PageName:this.PageName,
     
    }

    this._crud.getFilters(data).subscribe(res => {
     console.log(res)
   this.filterswrapper=res;

  })
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProductDetails(this.filters, this.currentPage, this.sorder);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getProductDetails(this.filters, this.currentPage,this.sorder);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.getProductDetails(this.filters, this.currentPage,this.sorder);
    }
  }

sortproducts()
{
  this.getProductDetails(this.filters, this.currentPage,this.sorder);
}

sodervalue(sorder:any, type:any)
{
this.sortValue=type;
this.sorder=sorder;
this.getProductDetails(this.filters, this.currentPage, this.sorder);
}
  /* test code */

  

}
