define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
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
        console.log(interaction);
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

        console.log(inArguments);

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
            }

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
