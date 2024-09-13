public with sharing class CustomMetadataController implements Metadata.DeployCallback {

    @AuraEnabled
    public static void saveMetadataTypeConfig(List<CustomMetadataTypeConfigWrapper> wrapper) {
        Metadata.DeployContainer container = new Metadata.DeployContainer();
        system.debug('wrapper saveMetadataTypeConfig ' + wrapper);
        try {

            for (CustomMetadataTypeConfigWrapper wrapperItem : wrapper) {
                system.debug('wrapperItem saveMetadataTypeConfig ' + wrapperItem);
                Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
                customMetadata.fullName = 'CustomMetadataType__mdt.' + wrapperItem.developerName;
                customMetadata.label = wrapperItem.developerName;
   

                Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();
                customField1.field = 'Number__c';
                customField1.value = wrapperItem.num;

                customMetadata.values.add(customField1);

                container.addMetadata(customMetadata);
                Id jobId = Metadata.Operations.enqueueDeployment(container,null);
                

            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static List<CustomMetadataType__mdt> getMetadataTypeConfig() {
        try {
            return CustomMetadataType__mdt.getAll().values();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getProfiles() {
        List<String> profiles = new List<String>();
        for(AggregateResult result : [SELECT Name FROM Profile GROUP BY Name ORDER BY Name Asc ]) {
            profiles.add(String.valueOf(result.get('Name')));
        }
        return  profiles;
    }

    @AuraEnabled(cacheable=true)
    public static list<Profiles_for_Deactivation__mdt> getCustomMetadataProfiles() {
        return Profiles_for_Deactivation__mdt.getAll().values();
    }

    public void handleResult(Metadata.DeployResult result, Metadata.DeployCallbackContext context) { 
        if (result.status == Metadata.DeployStatus.Succeeded) {
            System.debug('Success Result-' + result);
        } else {
            System.debug('error Result-' + result);
        }
    }


    @AuraEnabled
    public static void saveCustomMetadataProfiles(List<MetadataProfileWrapper> wrapper) {
        Metadata.DeployContainer container = new Metadata.DeployContainer();
        try {
            for (MetadataProfileWrapper ms : wrapper) {
                system.debug('ms: '+ ms);

                Metadata.CustomMetadata newMeta = new Metadata.CustomMetadata();
                
                newMeta.fullName = 'Profiles_for_Deactivation__mdt.' + ms.label.remove(':').replace(' ', '').replace('-','_').replace('.','');
                newMeta.label = ms.label;

                Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();
                customField1.field = 'IsActive__c';
                customField1.value = ms.isActive;
                newMeta.values.add(customField1);
                container.addMetadata(newMeta);

            }
            CustomMetadataController callback = new CustomMetadataController();
            Id jobId = Metadata.Operations.enqueueDeployment(container, callback);
            system.debug('jobId***: '+jobId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }



    public class MetadataProfileWrapper {
        @AuraEnabled
        public string label { get; set; }
        @AuraEnabled
        public Boolean isActive { get; set; }

    }

    public class CustomMetadataTypeConfigWrapper {
        @AuraEnabled
        public Integer num { get; set; } 
        @AuraEnabled
        public String  developerName { get; set; }
    }
    
}