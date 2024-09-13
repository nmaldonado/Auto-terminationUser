import { LightningElement } from 'lwc';
import getCustomMetadataProfiles from '@salesforce/apex/CustomMetadataController.getCustomMetadataProfiles';
import getProfiles from '@salesforce/apex/CustomMetadataController.getProfiles';
import saveCustomMetadataProfiles from '@salesforce/apex/CustomMetadataController.saveCustomMetadataProfiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveMetadataTypeConfig from '@salesforce/apex/CustomMetadataController.saveMetadataTypeConfig';
import getMetadataTypeConfig from '@salesforce/apex/CustomMetadataController.getMetadataTypeConfig';

export default class customMetadataConfig extends LightningElement {
    profilesObj = [];
    customMetaProfiles = [];
    selectedValues = [];
    deactivationDays = 0;
    deactivationDaysIsChanged;
    warningDays = 0;
    warningDaysIsChanged;


    async connectedCallback() {
        try{
            const result = await getCustomMetadataProfiles();

            const result2 = await getProfiles();

            const result3 = await getMetadataTypeConfig();

            //loadMetadataTypesConfig();
            this.deactivationDays = result3[0].Number__c;
            this.warningDays = result3[1].Number__c;

            //load existent metadata
            this.customMetaProfiles = result.map((v) => Object.assign({}, { label: v.MasterLabel, value: v.MasterLabel }));

            //load all profiles
            this.profilesObj = result2.map((v) => Object.assign({}, { label: v, value: v }));

            //add all profiles not in meta to available option
            this.profilesObj.filter((p) => !this.customMetaProfiles.map((c) => c.label).includes(p.label)).forEach((p) => {
                this.customMetaProfiles.push(p);
            });

            
            //filter selected values
            result.filter((m) => m.isActive__c == true).forEach((v) => { this.selectedValues.push(v.MasterLabel); });

        } catch{
            console.log('error');
        }
    }
    handleDeactivationDays(e) {
        this.deactivationDays = e.detail.value;
        this.deactivationDaysIsChanged = true;
    }

    handleWarningDays(e) {
        this.warningDays = e.detail.value;
        this.warningDaysIsChanged = true;
    }

    handleProfileSelection(e) {
        this.selectedValues = [];
        this.selectedValues.push(...e.detail.value);
    }

    async saveSelection() {
        const selectionForSave = [];
        this.selectedValues.forEach((s) => { 
            selectionForSave.push({ label: s, isActive: true });
        });
        this.customMetaProfiles.filter((c) => !this.selectedValues.includes(c.label)).forEach((c) => {
            selectionForSave.push({ label: c.label, isActive: false });
        });

        const metadataTypeConfigList = [];

        if(this.warningDaysIsChanged){
            metadataTypeConfigList.push({
                developerName: 'WarningThresholdInDays',
                num: this.warningDays
            });
        }
        if(this.deactivationDaysIsChanged){
            metadataTypeConfigList.push({
                developerName: 'DeactivationThresholdInDays',
                num: this.deactivationDays
            });
        }
        try {
            if(metadataTypeConfigList.length > 0) {
                await saveMetadataTypeConfig({ wrapper:  metadataTypeConfigList });
            }

            await saveCustomMetadataProfiles({ wrapper: selectionForSave });
            this.showToast('Success', 'Saved', 'success');
        } catch (e) {
            this.showToast('Error', e.body.message, 'error');
        }
    }

    showToast(message,title, variant) {
        const event = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}