global without sharing class naics {
    public naics() {
    }

    @AuraEnabled(Cacheable=true)
    public static string GetNAICS()
    {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        NAICS__mdt[] naicsmdt = [SELECT URL__c FROM NAICS__mdt];
        string naicsURL = naicsmdt[0].URL__c;

        request.setEndpoint(naicsURL);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        system.debug(response.getStatusCode());
        if (response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            //Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            return response.getBody();
        }
        return null;
    }

    @AuraEnabled(Cacheable=true)
    public static Boolean IsAccount(Id Id)
    {
        String sobjectType = Id.getSObjectType().getDescribe().getName();
        if(sobjectType == 'Account')
            return true;

        return false;
    }
}
