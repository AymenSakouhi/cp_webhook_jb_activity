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
        console.log(JSON.stringify(interaction));
        console.log(eventDefinitionKey);
        console.log(entryObject);
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
              
            });
        });

        $('#url').val(url);
        $('#payload').val(contentJSON);

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
        default:
          //code to be executed if n is different from case 1 and 2
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
                "phone": "{{Event."+ eventDefinitionKey + ".\"" + firstName + "\"}}",
            },
        ];
        
        payload['metaData'].isConfigured = true;

        console.log(JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
    }

    function getURL() {
        console.log('getURL: ' + $('#url').val());
        return $('#url').val().trim();
    }

    function getcontentJSON() {
        console.log('getcontentJSON: ' + $('#payload').val());
        return $('#payload').val().trim();
    }


});
