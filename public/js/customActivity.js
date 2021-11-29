define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var eventDefinitionKey;
    var entryObject;
    var journeyName;
    var entryTitle;

    console.log( 'Call customActivity.js' );

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');  

        $('#url').change(function() {
            var url = getURL();
        });

        $('#domain').change(function() {
            var domain = getDomain();
        });

        $('#payload').change(function() {
            var contentJSON = getcontentJSON();
        });

        $('#entryObject').change(function() {
            var selectEntryObject = getEntryObject();
        });

    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        eventDefinitionKey = interaction.triggers[0].metaData.eventDefinitionKey;
        entryObject = interaction.triggers[0].configurationArguments.objectAPIName;
        entryTitle = interaction.triggers[0].metaData.title;
        journeyName = interaction.name;
        console.log(JSON.stringify(interaction));
        console.log('EDK: ' + eventDefinitionKey);
        console.log('EO: ' + entryObject);
        console.log('ET: ' + entryTitle);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var url;
        var contentJSON;
        var domain;
        var selectEntryObject;
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Activity inArguments: ', inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                console.log("inArg key: " + key);
                console.log("inArg val: " + val);
                if (key === 'url') {
                    url = val;
                }

                if (key === 'contentJSON') {
                    contentJSON = val;
                }

                if (key === 'domain') {
                    domain = val;
                }
                if (key === 'selectEntryObject') {
                    selectEntryObject = val;
                }
              
            });
        });

        $('#url').val(url);
        $('#payload').val(contentJSON);
        $('#domain').val(domain);
        $('#entryObject').val(selectEntryObject);
        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

        var name = 'DEV Webhook Settings';
        var url = getURL();
        var contentJSON = getcontentJSON();
        var domain = getDomain();
        var selectEntryObject = getEntryObject();
        var preObject;
        var firstName;
        var lastName;
        var accountId;
        var opportunityId;
        var stageName;
        var programFamily;
        var cpAccountId;
        var salutation;
        var productName;
        var productFamily;
        var productId;
        var degree;
        var createdDate;
        var optIn;
        var country;
        var voucher;
        var workExperience;
        var budget;
        var rate;
        var studyAdvisor;
        var phone;
        var obwKey;

        if (entryTitle == 'Data Extension') {
            entryObject = 'DE';
        }

        switch(selectEntryObject)
        {
        case 'Opportunity':
            firstName = 'Opportunity:Account:FirstName';
            lastName = 'Opportunity:Account:LastName';
            accountId = 'Opportunity:Account:Id';
            opportunityId = 'Opportunity:Id';
            stageName = 'Opportunity:StageName';
            programFamily = 'Opportunity:ProgramFamily__c';
            cpAccountId = 'Opportunity:Account:CP_Account_ID__c';
            salutation = 'Opportunity:Account:Salutation';
            productName = 'Opportunity:CourseOfStudyLookup__r:Product_Display_Name__c';
            productFamily = 'Opportunity:CourseOfStudyLookup__r:Family';
            productId = 'Opportunity:CourseOfStudyLookup__r:Id';
            degree = 'Opportunity:DegreeName__c';
            createdDate = 'Opportunity:CreatedDate';
            optIn = 'Opportunity:Account:OptInEmail__c';
            country = 'Opportunity:Account:ShippingCountry';
            voucher = 'Opportunity:VoucherID__c';
            workExperience = 'Opportunity:WorkExperience__c';
            budget = 'Opportunity:BudgetPerMonth__c';
            rate = 'Opportunity:RatePerInterval__c';
            studyAdvisor = 'Opportunity:StudyAdvisor__c';
            phone = 'Opportunity:Account:Phone';
            obwKey = 'Opportunity:ObwUserKey__c';
          break;
        case 'OpportunityArchive__c':
            firstName = 'OpportunityArchive__c:Account__r:FirstName';
            lastName =  'OpportunityArchive__c:Account__r:LastName';
            accountId = 'OpportunityArchive__c:Account__r:Id';
            opportunityId =  'OpportunityArchive__c:Opportunity__r:Id';
            stageName = 'OpportunityArchive__c:StageName__c';
            programFamily = 'OpportunityArchive__c:Program_Family__c';
            salutation = 'OpportunityArchive__c:Account__r:Salutation';
            productName = 'OpportunityArchive__c:CourseOfStudy__r:Product_Display_Name__c';
            productFamily = 'OpportunityArchive__c:CourseOfStudy__r:Family';
            productId = 'OpportunityArchive__c:CourseOfStudy__r:Id';
            degree = 'OpportunityArchive__c:degree__c';
            optIn = 'OpportunityArchive__c:Account__r:OptInEmail__c';
            country = 'OpportunityArchive__c:Account__r:ShippingCountry';
            voucher = 'OpportunityArchive__c:VoucherID__c';
            workExperience = 'OpportunityArchive__c:WorkExperience__c';
            budget = 'OpportunityArchive__c:BudgetPerMonth__c';
            rate = 'OpportunityArchive__c:RatePerInterval__c';
            phone = 'OpportunityArchive__c:Account__r:Phone';
            obwKey = 'OpportunityArchive__c:ObwUserKey__c';
            break;
        case 'DE':
            firstName = 'First Name';
            lastName = 'Last Name';
            accountId = 'Account ID';
            opportunityId = 'Opportunity ID';
            stageName = 'Stage';
            programFamily = 'Program Family';
            cpAccountId = 'CP Account ID';
            salutation = 'Opportunity:Account:Salutation';
            productName = 'Course Of Study Lookup: Product Display Name';
            productFamily = 'Opportunity:CourseOfStudyLookup__r:Family';
            productId = 'Opportunity:CourseOfStudyLookup__r:Id';
            degree = 'Degree_old';
            createdDate = 'Created Date';
            optIn = 'Opt-In Email';
            country = 'Country';
            voucher = 'Voucher ID';
            workExperience = 'Opportunity:WorkExperience__c';
            budget = 'Opportunity:BudgetPerMonth__c';
            rate = 'Opportunity:RatePerInterval__c';
            studyAdvisor = 'Study Advisor: Full Name';
            phone = 'Phone 1';
            obwKey = 'ObwUserKey';
            break;
        default:
            /*firstName = 'Opportunity:Account:FirstName';
            lastName = 'Opportunity:Account:LastName';
            accountId = 'Opportunity:Account:Id';
            opportunityId = 'Opportunity:Id';
            stageName = 'Opportunity:StageName';
            programFamily = 'Opportunity:ProgramFamily__c';
            cpAccountId = 'Opportunity:Account:CP_Account_ID__c';
            salutation = 'Opportunity:Account:Salutation';
            productName = 'Opportunity:CourseOfStudyLookup__r:Product_Display_Name__c';
            productFamily = 'Opportunity:CourseOfStudyLookup__r:Family';
            productId = 'Opportunity:CourseOfStudyLookup__r:Id';
            degree = 'Opportunity:DegreeName__c';
            createdDate = 'Opportunity:CreatedDate';
            optIn = 'Opportunity:Account:OptInEmail__c';
            country = 'Opportunity:Account:ShippingCountry';
            voucher = 'Opportunity:VoucherID__c';
            workExperience = 'Opportunity:WorkExperience__c';
            budget = 'Opportunity:BudgetPerMonth__c';
            rate = 'Opportunity:RatePerInterval__c';
            studyAdvisor = 'Opportunity:StudyAdvisor__c';
            phone = 'Opportunity:Account:Phone';*/
            firstName = 'OpportunityArchive__c:Account__r:FirstName';
            lastName =  'OpportunityArchive__c:Account__r:LastName';
            accountId = 'OpportunityArchive__c:Account__r:Id';
            opportunityId =  'OpportunityArchive__c:Opportunity__r:Id';
            stageName = 'OpportunityArchive__c:StageName__c';
            programFamily = 'OpportunityArchive__c:Program_Family__c';
            salutation = 'OpportunityArchive__c:Account__r:Salutation';
            productName = 'OpportunityArchive__c:CourseOfStudy__r:Product_Display_Name__c';
            productFamily = 'OpportunityArchive__c:CourseOfStudy__r:Family';
            productId = 'OpportunityArchive__c:CourseOfStudy__r:Id';
            degree = 'OpportunityArchive__c:degree__c';
            optIn = 'OpportunityArchive__c:Account__r:OptInEmail__c';
            country = 'OpportunityArchive__c:Account__r:ShippingCountry';
            voucher = 'OpportunityArchive__c:VoucherID__c';
            workExperience = 'OpportunityArchive__c:WorkExperience__c';
            budget = 'OpportunityArchive__c:BudgetPerMonth__c';
            rate = 'OpportunityArchive__c:RatePerInterval__c';
            phone = 'OpportunityArchive__c:Account__r:Phone';
            obwKey = 'OpportunityArchive__c:ObwUserKey__c';
        }
        payload.name = name;



        payload['arguments'].execute.inArguments = [
            {
                "tokens": authTokens 
            },
            { 
                "url": url 
            }, 
            { 
                "contentJSON": contentJSON
            },
            {
                "emailAddress": "{{InteractionDefaults.Email}}"
            },
            {
                "EntryObject": entryObject,
            },
            
            {
                "firstName": "{{Event."+ eventDefinitionKey + ".\"" + firstName + "\"}}",
            },
            {
                "phone": "{{Event."+ eventDefinitionKey + ".\"" + phone + "\"}}",
            },
            { "lastName": "{{Event."+ eventDefinitionKey + ".\"" + lastName + "\"}}"},
            { "opportunityId": "{{Event."+ eventDefinitionKey + ".\"" + opportunityId + "\"}}" },
            { "stageName": "{{Event."+ eventDefinitionKey + ".\"" + stageName + "\"}}" },
            { "programFamily": "{{Event."+ eventDefinitionKey + ".\"" + programFamily + "\"}}" },
            { "cpAccountId": "{{Event."+ eventDefinitionKey + ".\"" + cpAccountId + "\"}}" },
            { "salutation": "{{Event."+ eventDefinitionKey + ".\"" + salutation + "\"}}" },
            { "productName": "{{Event."+ eventDefinitionKey + ".\"" + productName + "\"}}" },
            { "productFamily": "{{Event."+ eventDefinitionKey + ".\"" + productFamily + "\"}}" },
            { "productId": "{{Event."+ eventDefinitionKey + ".\"" + productId + "\"}}" },
            { "degree": "{{Event."+ eventDefinitionKey + ".\"" + degree + "\"}}" },
            { "createdDate": "{{Event."+ eventDefinitionKey + ".\"" + createdDate + "\"}}" },
            { "optIn": "{{Event."+ eventDefinitionKey + ".\"" + optIn + "\"}}" },
            { "country": "{{Event."+ eventDefinitionKey + ".\"" + country + "\"}}" },
            { "voucher": "{{Event."+ eventDefinitionKey + ".\"" + voucher + "\"}}" },
            { "workExperience": "{{Event."+ eventDefinitionKey + ".\"" + workExperience + "\"}}" },
            { "budget": "{{Event."+ eventDefinitionKey + ".\"" + budget + "\"}}" },
            { "rate": "{{Event."+ eventDefinitionKey + ".\"" + rate + "\"}}" },
            { "studyAdvisor": "{{Event."+ eventDefinitionKey + ".\"" + studyAdvisor + "\"}}" },
            { "contactId": "{{Contact.Key}}"},
            { "domain": domain},
            { "journeyName": journeyName },
            { "edk": eventDefinitionKey },
            { "entryTitle": entryTitle },
            { "selectEntryObject": selectEntryObject },
            { "obwKey": "{{Event."+ eventDefinitionKey + ".\"" + obwKey + "\"}}" },


        ];
        
        payload['metaData'].isConfigured = true;

        console.log('Payload: ' + JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }

    function getURL() {
        console.log('getURL: ' + $('#url').val());
        return $('#url').val().trim();
    }

    function getDomain() {
        console.log('getDomain: ' + $('#domain').val());
        return $('#domain').val().trim();
    }

    function getcontentJSON() {
        console.log('getcontentJSON: ' + $('#payload').val());
        return $('#payload').val().trim();
    }

    function getEntryObject() {
        console.log('EntryObject: ' + $('#entryObject').val());
        return $('#entryObject').val().trim();
    }


});
