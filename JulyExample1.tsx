import * as React from 'react';
import styles from './JulyExample1.module.scss';
import { IJulyExample1Props } from './IJulyExample1Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField, Stack, IDropdownOption, Dropdown, IDropdownStyles, 
  IStackStyles, DatePicker, Toggle, PrimaryButton } from '@fluentui/react';
  import Service from './Service';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";


const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { padding: 10 } };
const stackButtonStyles: Partial<IStackStyles> = { root: { Width: 100 } };

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
  { key: 'Choice 1', text: 'Choice 1' },
  { key: 'Choice 2', text: 'Choice 2' },
  { key: 'Choice 3', text: 'Choice 3' },
];

export interface IExample1FieldsState{
  title:string;
  desciption:string;
  choice:any;
  date:any;
  yesNo:boolean;
  hyperlink:string;
  user:any;
  file:any;
}



export default class JulyExample1 extends React.Component<IJulyExample1Props, IExample1FieldsState> {
  public _service:any;
  public constructor(props:IJulyExample1Props){
    super(props);
    this.state={
      title:"",
      desciption:"",
      choice:null,
      date:null,
      yesNo:false,
      hyperlink:"",
      user:null,
      file:null
    };
    this._service = new Service(this.props.url);
  }


  private changeTitle(data:any):void{
    this.setState({title:data.target.value});
  }

  private changeDesciption(data:any):void{
    this.setState({desciption:data.target.value});
  }

  private changeHyperlink(data:any):void{
    this.setState({hyperlink:data.target.value});
  }

  private changeYesNo(data:any):void{
    if(data.target.ariaChecked == "false")
      this.setState({yesNo:true});
    else 
      this.setState({yesNo:false});
  }

  private changeChoice(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption):void{
    this.setState({choice:item});
  }

  private changeDate(data:Date):void{
    this.setState({date:data});
  }

  private fileChangeHandler(event:any):void{
    //this.setState({date:data});
    this.setState({file:event.target.files[0]});

  }

  private OnBtnClick():void{
    console.log(this.state);
    let inputData:any=
    {
      Title: this.state.title,
      Description: this.state.desciption,
      Choices:(this.state.choice == null ? "":this.state.choice.key),
      YesNo:this.state.yesNo,
      Date:this.state.date,
      Hyperlink:{Url:"https://"+this.state.hyperlink+".com"},
      PersonGroupId:(this.state.user == null ? 0:this.state.user.Id)
    };

    this._service.addItemToSPList(inputData,this.state.file);
  }

  private _getPeoplePickerItems(items: any[]) {
    console.log('Items:', items);
    if(items.length>0)
    {
      let userInfo = this._service.getUserByLogin(items[0].loginName).then((info)=>{
           this.setState({user:info});
           console.log(info);
      });
      
    }
      
    else
      this.setState({user:null});
  }




  public render(): React.ReactElement<IJulyExample1Props> {
    return (

      <Stack tokens={stackTokens} styles={stackStyles}>
        <Stack>
            <TextField 
              label="Title" 
              value={this.state.title}
              onChange={this.changeTitle.bind(this)}
            />

            <TextField 
              label="Description" 
              multiline rows={3} 
              value={this.state.desciption}
              onChange={this.changeDesciption.bind(this)}
            />

            <Dropdown
                placeholder="Select an option"
                label="Choices"
                options={options}
                styles={dropdownStyles}
                selectedKey={this.state.choice ? this.state.choice.key : undefined}
                onChange={this.changeChoice.bind(this)}
            />

            <DatePicker 
              placeholder="Select a date..." 
              ariaLabel="Select a date" 
              label="Date"
              value={this.state.date}
              onSelectDate={this.changeDate.bind(this)}
            />

            <Toggle 
              label="Yes/No" 
              onText="Yes" 
              offText="No"
              checked={this.state.yesNo}
              onChange={this.changeYesNo.bind(this)} 
            />

            <TextField
              label="Hyperlink"
              prefix="https://"
              suffix=".com"
              ariaLabel="Example text field with https:// prefix and .com suffix"
              value={this.state.hyperlink}
              onChange={this.changeHyperlink.bind(this)}
            />
             <PeoplePicker
                context={this.props.context}
                titleText="People Picker"
                personSelectionLimit={1}
                groupName={""} // Leave this blank in case you want to filter from all users
                showtooltip={true} 
                required={false}
                disabled={false}
                onChange={this._getPeoplePickerItems.bind(this)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000} />
                <br/>
                <input type="file" name="file" onChange={this.fileChangeHandler.bind(this)} />


        </Stack>
        <Stack >
        <PrimaryButton text="Primary" onClick={this.OnBtnClick.bind(this)} styles={stackButtonStyles} />
        </Stack>
        </Stack>
      
    );
  }
}
