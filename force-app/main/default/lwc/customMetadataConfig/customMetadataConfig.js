import { LightningElement, wire } from 'lwc';
import getProfilesObjectInfo from '@salesforce/apex/CustomMetadataController.getProfiles';
import getCustomMetadataProfiles from '@salesforce/apex/CustomMetadataController.getCustomMetadataProfiles';

export default class customMetadataConfig extends LightningElement {

    listOptions = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
    ];
    defaultOptions = ['7', '2', '3'];


    profiles = [];
    customMetaProfiles = [];

    @wire(getProfilesObjectInfo)
    getProfiles({ error, data }) {
        if(data){
            this.profiles = data.map((v) => Object.assign({}, { label: v.Name, value: v.Name }));
        }
    }

    @wire(getCustomMetadataProfiles)
    getCustomMetadataProfiles({ error, data }) {
        if(data) {
            this.customMetaProfiles = data.map((v) => Object.assign({}, { label: v.MasterLabel, value: v.MasterLabel }));
        }
    }


    connectedCallback() {

        this.profiles.forEach(e => {
            this.customMetaProfiles.forEach(c => {
                if(e.value == c.value){
                    this.selectedValues.push(e);
                }
            });
        });
    }


    handleChange(event) {
        // Get the list of the "value" attribute on all the selected options
        const selectedOptionsList = event.detail.value;
        alert(`Options selected: ${selectedOptionsList}`);
    }
}