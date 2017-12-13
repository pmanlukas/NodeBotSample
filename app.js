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
    session.send("Hi");
    console.log(session.message.text);
});