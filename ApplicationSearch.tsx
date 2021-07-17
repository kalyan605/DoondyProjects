import * as React from 'react';
import styles from './ApplicationSearch.module.scss';
import { IApplicationSearchProps } from './IApplicationSearchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";

import {
  TextField, Stack, IDropdownOption, Dropdown, IDropdownStyles,
  IStackStyles, DatePicker, Toggle, PrimaryButton, Label, getHighContrastNoAdjustStyle, IconButton, IStackTokens, StackItem
} from '@fluentui/react';

import { Grid, Checkbox, Paper, Table, ModalManager } from '@material-ui/core';

import Service from './Service';
import { Item } from '@pnp/sp/items';

//const logo: any = require('./Images/one.jpg');
const sectionStackTokens: IStackTokens = { childrenGap: 10 };
const stackTokens = { childrenGap: 80 };
const stackStyles: Partial<IStackStyles> = { root: { padding: 10 } };
const stackButtonStyles: Partial<IStackStyles> = { root: { Width: 20 } };
const logo: any = require('./Images/MyLine.png');



const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};


export interface IEditFormProps {

}

export interface IEditFormState {
  layoutOption: string;
  list: any;
  flag: boolean;
  TypedEnterflag: boolean;
  TotalPages: number;
  myRecIndex:number;
  
}


const options: IDropdownOption[] = [


  { key: 'Category', text: 'Category' },
  { key: 'ApplicationName', text: 'Application Name' },

];

export interface IApplicationSearchState {
  operation: any;
  SearchText: any;
  listItems: any[];
  ItemInfo: any;
  ItemId: number;
  flag: boolean;
  userExsits: boolean;
  TypedEnterflag: boolean;
  TotalPages: number;
  myRecIndex:number;
  TempListItems:any[];
  NofItemsPerPage:number;
  
  
}

export default class ApplicationSearch extends React.Component<IApplicationSearchProps, IApplicationSearchState> {

  public _service: any;

  public constructor(props: IApplicationSearchProps) {
    super(props);
    this.state = {

      operation: null,
      SearchText: "",
      listItems: [],
      ItemInfo: "",
      ItemId: null,
      flag: false,
      userExsits: false,
      TypedEnterflag: false,
      TotalPages: null,
      myRecIndex:null,
      TempListItems:[],
      NofItemsPerPage:10
      


    };

    this._service = new Service(this.props.url, this.props.context);

  }

  private changeTitle(data: any): void {

    this.setState({ SearchText: data.target.value });

    // let inputData: any =
    // {
    //   Title: this.state.SearchText,

    //   SelcatVal: this.state.operation

    // };

    // let listItems = this._service.GetData(inputData);

    // this.setState({ listItems: listItems });
  
    // let TempArray2=[];


    // for(let count=0;count<10;count++)
    // {
    //   TempArray2.push(listItems[count]);
     
    // }

    // this.setState({TempListItems:TempArray2});

    //let TempListItems=this._service.pagGetData(inputData);

  }

  private changeChoice(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void {


    this.setState({ operation: item, SearchText: '', listItems: [], ItemInfo: '', flag: false, TypedEnterflag: false });
  }


  public async getSelectedListItems() {

    const GroupName = 'CatlogueAdmins';

    let result = await this._service.isCurrentUserMemberOfGroup(GroupName);

    this.setState({ userExsits: result });




    let inputData: any =
    {
      Title: this.state.SearchText,

      SelcatVal: this.state.operation,

      UserFindVal: this.state.userExsits

    };


    

    let listItems = await this._service.GetData(inputData);
   
    this.setState({ listItems: listItems });

    
    //this.setState({ TotalPages: Math.ceil(this.state.listItems.length / this.NofItemsPerPage) });

    this.setState({ TotalPages: Math.ceil(this.state.listItems.length / this.state.NofItemsPerPage) });

    if (listItems.length == 0) {

      this.setState({ TypedEnterflag: true });

    }

    if(listItems.length>10)
    {


      let TempArray2=[];


      for(let count=0;count<this.state.NofItemsPerPage;count++)
      {
        TempArray2.push(listItems[count]);
       
      }
  
      this.setState({TempListItems:TempArray2});

    }

    else
    {

      this.setState({TempListItems:listItems});
    }


  }


  private OnBtnClick(): void {


    if (this.state.operation == null || this.state.operation.key == 'Select') {

      alert('please select any value');

    }

    else if (this.state.SearchText == '' || this.state.SearchText == null) {

      alert('please enter value');

    }

    else {

      console.log('Button Clicked');


      this.getSelectedListItems();

    }
  }




  public handleKeyPress(event) {


    if (event.key === 'Enter' && this.state.SearchText != '') {

      this.getSelectedListItems();
      


    }

    else if (event.key === 'Enter' && this.state.SearchText == '') {

      alert('Please enter the value');

    }
  }


  public onBackbuttonClick() {


    this.setState({ flag: false });


  }

  private async GetRecordsByID(event, itemId) {


    let ItemInfo = await this._service.getItemByID(itemId);

    if (ItemInfo.Title != '') {

      this.setState({ flag: true });

      this.setState({ ItemInfo: ItemInfo });

    }

  }

  private _getPage(page: number) {

    console.log('Page:', page);

    let TempArray2=[];

     let listItems=this.state.listItems;

     
      for( let count=(page-1)*this.state.NofItemsPerPage+1; count<listItems.length &&  count<(this.state.NofItemsPerPage*page);count++ )
      {
            
        TempArray2.push(listItems[count]);
       
      }
  
      this.setState({TempListItems:TempArray2});

  }




  public render(): React.ReactElement<IApplicationSearchProps> {

    return (


      <Stack tokens={sectionStackTokens}>
        {this.state.flag == false &&
          <Stack horizontal tokens={sectionStackTokens}>

            <StackItem className={styles.coststyle}>

              <Dropdown
                placeholder="Quick Search"
                options={options}

                selectedKey={this.state.operation ? this.state.operation.key : undefined}
                onChange={this.changeChoice.bind(this)}
              />
            </StackItem>
            <StackItem className={styles.Serachtextbox}>

              <input type="text" name="txttest" value={this.state.SearchText} onChange={this.changeTitle.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} className={styles.boxsize} />

            </StackItem>
            <StackItem>

              <PrimaryButton text="Search" onClick={this.OnBtnClick.bind(this)} styles={stackButtonStyles} className={styles.button} />
            </StackItem>
          </Stack>
        }
        <Stack>
          <br />
        </Stack>

        {this.state.listItems.length == 0 && this.state.flag == false && this.state.TypedEnterflag == true &&

          <Stack className={styles.myBackcolor}>

            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.msTeams}>
                <b>Records Not found with the Above Criteria</b>
              </StackItem>
            </Stack>
          </Stack>
        }


        {this.state.flag == false  && this.state.TempListItems.map((item, index) => (
        
        
          <Stack className={styles.myBackcolor}>

            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.msTeams}>
                {item.Title}
              </StackItem>
              <StackItem>
                {<PrimaryButton text="Details" onClick={(event) => { this.GetRecordsByID(event, item.ID) }} styles={stackButtonStyles} className={styles.button} value={item.ID} />}
              </StackItem>
            </Stack>

            <br />

            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.categorysize}>
                <b>Category</b>:{item.Category}
              </StackItem>
              <StackItem className={styles.categorysize}>
                <b>Licence Owner:</b>{item.RelationshiporLicenceowner}
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.categorysize}>
                <b>Currency:</b>{item.Curr}
              </StackItem>
              <StackItem className={styles.categorysize}>
                <b>Cost:</b>{item.Cost}
              </StackItem>
            </Stack>


          </Stack>
        )

       
        )
               
        

        }

        

        {/* //paging */}


        {this.state.listItems.length > 10 && this.state.flag == false &&

          <Pagination
            currentPage={0}
            totalPages={this.state.TotalPages}
            onChange={(page) => this._getPage(page)}
            limiter={3} // Optional - default value 3
            limiterIcon={"More"} // Optional
          />

        }



        {/* //End */}



        {this.state.flag == true && this.state.userExsits == false &&

          //Normal Details Screen

          <Stack className={styles.myBorder}>
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem>
                <PrimaryButton text="NormalBack ←" styles={stackButtonStyles} className={styles.button} onClick={(event) => { this.onBackbuttonClick() }} />
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.DetAppName}>
                <b>{this.state.ItemInfo.Title} </b>
              </StackItem>
              <StackItem className={styles.coststyle}>
                <b>APPID:</b>{this.state.ItemInfo.SoftwareID}
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.commonstyle}>
                <b>Category:</b> {this.state.ItemInfo.Category}
              </StackItem>
              <StackItem className={styles.commonstyle}>
                <b>Bussiness Owner:</b>{this.state.ItemInfo.BusOwner}
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.commonstyle}>
                <b>License Required:</b>{this.state.ItemInfo.LicenceReq}
              </StackItem>
              <StackItem className={styles.commonstyle}>
                <b>Cost:</b>{this.state.ItemInfo.Cost}
              </StackItem>
            </Stack>
          </Stack>


        }


        {this.state.flag == true && this.state.userExsits == true &&

          //Admin Desingn Screen
          <Stack>
          <Stack className={styles.myBackcolor}>
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem>
                {/* <PrimaryButton text="AdminBack ←"  styles={stackButtonStyles} className={styles.button}  onClick={(event) => {this.onBackbuttonClick()}}/> */}
                <IconButton iconProps={{ iconName: "Back" }} styles={stackButtonStyles} className={styles.button} title="Back" ariaLabel="Back" onClick={(event) => { this.onBackbuttonClick() }} />
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.DetAppName}>
                <b> {this.state.ItemInfo.Title}</b>
              </StackItem>
              <StackItem className={styles.coststyle}>
                <b> APPID</b>:{this.state.ItemInfo.SoftwareID}
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.commonstyle}>
                <b> Category</b>:{this.state.ItemInfo.Category}
              </StackItem>
              <StackItem className={styles.commonstyle}>
                <b>Bussiness Owner</b>:{this.state.ItemInfo.BusOwner}
              </StackItem>
            </Stack>
            <br />
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.commonstyle}>
                <b>License Required</b>: {this.state.ItemInfo.LicenceReq}
              </StackItem>
              <StackItem className={styles.commonstyle}>
                <b>Cost</b>: {this.state.ItemInfo.Cost}
              </StackItem>
            </Stack>
            </Stack>
            <br />
            <Stack>
            <Stack horizontal tokens={sectionStackTokens}>
              <StackItem className={styles.myDescBox}>
                <Stack>  
                <b>Description</b>
                <br />
                <Stack className={styles.whitDescBox}>
                  {this.state.ItemInfo.Description}
                </Stack>
                </Stack>
              </StackItem>
              <StackItem className={styles.myDescRightBox}>
                <Stack horizontal tokens={sectionStackTokens} className={styles.myBackcolor}>
                  <StackItem className={styles.commonstyle}>
                    <b>Technical Owner</b> :{this.state.ItemInfo.TechnicalOwner}<br /><br />
                    <b>Currency</b> : {this.state.ItemInfo.Curr}<br /><br />
                    <b>Frequencey</b>: {this.state.ItemInfo.Frequency}<br /><br />
                    <b>Cont</b>: {this.state.ItemInfo.Count}
                  </StackItem>

                  <StackItem>

                    <img src={logo} />

                  </StackItem>
                  <StackItem className={styles.commonstyle}>
                    <b>Support</b> :{this.state.ItemInfo.Supports}<br /><br />
                    <b>Contact Name</b> : {this.state.ItemInfo.ContactName}<br /><br />
                    <b>Tel or Mobile</b>: {this.state.ItemInfo.TelorMobile}<br /><br />
                    <b>Toogle Hide</b>: {this.state.ItemInfo.ToggleHide}

                  </StackItem>

                </Stack>
              </StackItem>


            </Stack>


          </Stack>
          </Stack>

        }


      </Stack>
     

    )

  }

}
















