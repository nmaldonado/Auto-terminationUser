public with sharing class CustomMetadataController {

    @AuraEnabled(cacheable=true)
    public static List<Profile> getProfiles() {
        return [SELECT Name FROM Profile ORDER BY Name Asc] ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Profiles_for_Deactivation__mdt> getCustomMetadataProfiles() {
        Map<String, Profiles_for_Deactivation__mdt> profilesMap = Profiles_for_Deactivation__mdt.getAll();
        return  profilesMap.values();
    }

    
}