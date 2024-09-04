public with sharing class ProfileController {
    
    @AuraEnabled(cacheable=true)
    public static List<Profile> getProfiles() {
        return [SELECT Id,Name FROM Profile ORDER BY Name Asc] ;
    }
}