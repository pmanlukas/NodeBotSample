var restify = require('restify');
var builder = require('botbuilder');
var keys = require('./constants');

// Setup Restify Server 
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    function () {
        console.log('%s listening to %s', server.name, server.url);
    });

// chat connector for communicating with the Bot Framework Service 
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users  
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:') 
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

//Methods to call textanalytics API
var header = { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': keys.TextKeys.APIKEY }

function sendGetSentimentRequest(message) {
    var options = {
        method: 'Post',
        uri: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
        body: {
            documents: [{ id: '1', language: 'en', text: message }]
        },
        json: true,
        headers: header
    };
    return rp(options);
}

function getGiphy(searchString) {
    var options = {
        method: 'GET',
        uri: 'https://api.giphy.com/v1/gifs/translate',
        qs: {
            s: searchString,
            api_key: '9n8AIaWULVu37sA1k8eE38IwnCCjmXP9'
        }
    }
    return rp(options);
}

//conversation with the user
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded[0].id === message.address.bot.id) {
        var reply = new builder.Message()
        .address(message.address)
        .text("Hello, I'm careBotyou! How's your day going?");

        bot.send(reply);
    }
});

bot.dialog('/', function(session){
    sendGetSentimentRequest(session.message.text).then(function(parsedBody){
        console.log(parsedBody);
        var score = parsedBody.documents[0].score.toString();
        if(score > 0.80) {
            session.beginDialog("/happy");
        } else if (score > 0.1) {
            session.beginDialog("/stressed");
        } else {
            session.beginDialog("/crisis");
        }
    })
    .catch(function(err){
        console.log("POST FAILED: " +err);
    });
});