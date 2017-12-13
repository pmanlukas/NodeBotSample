var keys = require('./constants');

var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

//restify server to connect the bot with the emulator
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('listening to %s', server.url);
})

//connector to connect the bot with the bot framework
//exchange with own data
var connector = new builder.ChatConnector({
    appId: keys.BotKeys.BOTID,
    appPassword: keys.BotKeys.BOTPASSWORD
});
var bot = new builder.UniversalBot(connector);

//route for incoming messages
server.post('/api/messages', connector.listen());

//default dialog/route for your bot
bot.dialog('/', function(session, args){
    if(!session.userData.greeting){
        session.send("Hello. What is your name?");
        session.userData.greeting = true;
    } else if (!session.userData.name) {
        getName(session);
    } else if (!session.userData.email){
        getEmail(session);
    } else if (!session.userData.password){
        getPassword(session);
    } else {
        session.userData = null;
    }

    session.endDialog();
});

//functions called in the root dialog are now defined
