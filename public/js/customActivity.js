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
        console.log('EO' + entryObject);
        console.log('ET' + entryTitle);
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
              
            });
        });

        $('#url').val(url);
        $('#payload').val(contentJSON);
        $('#domain').val(domain);
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

        var name = 'Webhook Settings';
        var url = getURL();
        var contentJSON = getcontentJSON();
        var domain = getDomain();
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

        if (entryTitle == 'Data Extension') {
            entryObject = 'DE';
        }

        switch(entryObject)
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
          break;
        case 'OpportunityArchive__c':
          firstName = 'OpportunityArchive__c:Account__r:FirstName'
          break;
        case 'DE':
            firstName = 'First Name';
            lastName = 'Last Name';
            accountId = 'Opportunity:Account:Id';
            opportunityId = 'Opportunity ID';
            stageName = 'Stage';
            programFamily = 'Program Family';
            cpAccountId = 'Opportunity:Account:CP_Account_ID__c';
            salutation = 'Opportunity:Account:Salutation';
            productName = 'Course Of Study Lookup: Product Display Name';
            productFamily = 'Opportunity:CourseOfStudyLookup__r:Family';
            productId = 'Opportunity:CourseOfStudyLookup__r:Id';
            degree = 'Degree_old';
            createdDate = 'Opportunity:CreatedDate';
            optIn = 'Opportunity:Account:OptInEmail__c';
            country = 'Country';
            voucher = 'Opportunity:VoucherID__c';
            workExperience = 'Opportunity:WorkExperience__c';
            budget = 'Opportunity:BudgetPerMonth__c';
            rate = 'Opportunity:RatePerInterval__c';
            studyAdvisor = 'Opportunity:StudyAdvisor__c';
            phone = 'Opportunity:Account:Phone';
            break;
        default:
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


});
