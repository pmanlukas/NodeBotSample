var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

//restify server to connect the bot with the emulator
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('listening to %s', server.url);
})