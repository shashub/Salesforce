import { LightningElement,track,api,wire } from 'lwc';
import naiccodes from '@salesforce/apex/naics.GetNAICS';
import isAccount from '@salesforce/apex/naics.IsAccount';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Naics1 extends LightningElement {

    @track searchKey;
    @api record;
    @api fieldname;
    @track records;
    @track error;
    @api iconname = "standard:account";
    @api checkiconname = "utility:success";
    @api success;
    @track success;
    @api recordId;

    @track naics;
    @track disableButton;
   
    @wire( naiccodes )
    wiredNaics({data, error}){
        if(data){
            //alert(data);
            this.naics = JSON.parse(data);
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.naics = undefined;
        }
    }

    @wire( isAccount, { Id: '$recordId'} )
    wiredAccount({data, error}){
        if(data){
            this.disableButton = ''
            this.error = undefined;
        }
        else if(!data)
        {
            this.disableButton = 'disabled'
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.naics = undefined;
        }
    }

    handleChange(event){
        /* eslint-disable no-console */
        const searchKey = event.target.value;
        event.preventDefault();
        if(searchKey.length > 1)
            this.LoadNaics(searchKey);
        else{
            this.records = [];
            this.template.querySelector("textarea").value = "";
        }    
    }

    LoadNaics(searchkey){
        
        var ar = [];
        for (var i = 0; i < this.naics.length; i++) {
            
            if(searchkey.length > 2 && this.naics[i].title.toLowerCase().includes(searchkey.toLowerCase())){
                ar.push(this.naics[i]);
            }
            else if(searchkey.length > 1 && this.naics[i].code.toString().startsWith(searchkey)){
                ar.push(this.naics[i]);
            }
            
        }
        this.records = ar;
        this.error = undefined;
    }

    handleSelect(event){
        //const selectedRecordId = event.detail;
        //alert(event.currentTarget.querySelector(".slds-listbox__option-text").innerHTML);
        this.template.querySelector("textarea").value = event.currentTarget.querySelector(".slds-listbox__option-text").innerHTML;
        let conList = this.template.querySelectorAll('.slds-text-heading_small');
        for (let i = 0; i < conList.length; i++){
            conList[i].children[0].variant = "";
        }
        event.currentTarget.querySelector(".slds-text-heading_small").children[0].variant = "Success"
        
        return;
    }

    AssignNAICS(event){

        var naicscodeandDesc = this.template.querySelector("textarea").value;
        var naicscodearray = naicscodeandDesc.split("--");
        var naicscode = naicscodearray[0];
        var naicsdesc = naicscodearray[1];
        const fields = {};
        fields["Id"] = this.recordId;
        fields["NaicsCode"] = naicscode;
        fields["NaicsDesc"] = naicsdesc;

        const recordInput = { fields };
        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account Is Updated',
                    variant: 'success',
                }),
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error on data save',
                    message: error.message.body,
                    variant: 'error',
                }),
            );
        });
        
    }

}