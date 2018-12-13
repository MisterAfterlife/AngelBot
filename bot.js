// Discord related
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

// Get HTML
var http = require('http');
var request = require("request");

// Parsing
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

// Youtube related
var ytlist = require('youtube-playlist');

// Externalized
var ascii = require('./ascii.js');
var comfy = require('./comfy.js');

// Command string settings
var currCommands = [
	"comfy",
	"ascii",
	"dailyd",
	"sbclip",
	"jtclip",
	"cursed"
];

bot.on('ready', function (evt) {
	logger.info('Connected moon2Dab');
    /*logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')'); */
});

function generateCommandStr()
{
	var str = "Here are the current commands for AngelBot...\n";
	
	currCommands.forEach(function(element){
		str += element + "\n"
	});
	
	return str;
}

// Main message bot
bot.on('message', function (user, userID, channelID, message, evt) {	
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
		
        args = args.splice(1);
		
        switch(cmd) {
			case 'commands':
				bot.sendMessage({
						to: channelID,
						message: generateCommandStr()
					});
				break;
				
            case 'comfy':
			    bot.sendMessage({
				to: channelID,
				message: "Processing Command"
				});	
						
                bot.sendMessage({
                    to: channelID,
                    message: comfy.links[Math.floor(Math.random() * (comfy.links.length))]
                });
				break;
				
			case 'ascii':		
				bot.sendMessage({
				to: channelID,
				message: "Grabbing Ascii Art"
				});	
				
				bot.sendMessage({
                    to: channelID,
                    message: ascii.text[Math.floor(Math.random() * (ascii.text.length))]
                });
				break;
				
			case "dailyd":
				bot.sendMessage({
				to: channelID,
				message: "Grabbing current Dinkster Day"
				});	
				
				var linkXML = "https://www.youtube.com/feeds/videos.xml?channel_id=UCYu1rWyr0TxTnHo99oW7ddA";
				request({
					uri: linkXML,
				}, function(err, resp, body){
						//console.log(body);
						parser.parseString(body, function(err, result){
							var link = "https://www.youtube.com/watch?v=";
							var jsonContent = result['feed']['entry'][0]['yt:videoId'];
							
							link += jsonContent;
							console.log(link);	
							bot.sendMessage({
								to: channelID,
								message: link
								});					
						});
				});
				break;	
				
			case "sbclip":		
				bot.sendMessage({
				to: channelID,
				message: "Grabbing Random Clip"
				});	
				
				// Since we are limited to 100 videos per playlist 
				// First we select a small playlist 
				var season = [
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtEdnhB-UiMOhvXWrqSaie2c", //Season 1
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtEj1qMglD8rj5jmqbWjevNi", //Season 2
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtFcWa5rATi4NvgPyBlvgBAM", //Season 3
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtGwezeo0IL5Ni6qz5TjtHpw", //Season 4
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtFjZ1A12rV2Ev0QGuq679z5", //Season 5
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtGHG3v8iI1Ygv6v3UO9ae5Q", //Season 6
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtEztS3eFOCz1y0fFvS-TlyM", //Season 7
					"https://www.youtube.com/playlist?list=PL3bW3WZKcvtEFmuzdUppvLhHqf4eCyVWU", //Season 8
					"https://www.youtube.com/playlist?list=PL-eCHXItuTKN6YxN6OwTplf1Gv6qYDffr", // Old Spongebob Clips
					"https://www.youtube.com/playlist?list=PLAyjAVQs06ZYseDv-x9DTTadKyb_F1IRr"	// spongebob funny clips	
				];
				var ytPlaylist = season[Math.floor(Math.random() * (season.length))];
				
				// Then we pass this playlist into our list reader
				ytlist(ytPlaylist, 'url').then(res => {
					//console.log(res.data.playlist.length);

					// Finally we randomly select a video from select playlist
					 bot.sendMessage({
						to: channelID,
						message: res.data.playlist[Math.floor(Math.random() * (res.data.playlist.length))]
						});	 
				});
				break;	
				
			case "jtclip":
				bot.sendMessage({
					to: channelID,
					message: "Grabbing Random Clip"
					});	
				
				var ytPlaylist = "https://www.youtube.com/playlist?list=PLxYiIn9OFNVcvphCxSAZgntXQoNn6jX4Q";
				
				ytlist(ytPlaylist, 'url').then(res => {
					//console.log(res.data.playlist.length);
					 bot.sendMessage({
						to: channelID,
						message: res.data.playlist[Math.floor(Math.random() * (res.data.playlist.length))]
						});	 
				});		
				break;
			
			case "cursed":
				bot.sendMessage({
					to: channelID,
					message: "Oh shi.. here we go"
					});	
				// First we select a small playlist 
				var cursed = [
					"https://www.youtube.com/playlist?list=PLQZgI7en5XEgM0L1_ZcKmEzxW1sCOVZwP",
					"https://www.youtube.com/playlist?list=PL3Tf4auUdjPT9zCjfYbAH5YTKJgfcrm6x",
					"https://www.youtube.com/playlist?list=PLpJ1rr5JPUt5j2KeQ8FYljf44lrwth62F",
					"https://www.youtube.com/playlist?list=PLrbDujlms45VvZ-xZtZuCegEyyYi3sHM6",
					"https://www.youtube.com/playlist?list=PLJPva5iVOFiYZrOSZuXrRSyXgpYesn1_v",
					"https://www.youtube.com/playlist?list=PLvWbVsM_67ULFKP4YVTBhbT95PT_U2Nwp",
					"https://www.youtube.com/playlist?list=PLHfC87H2OYjUBMU3q8cBrvYysFE8IBVS1"
				];
				var ytPlaylist = cursed[Math.floor(Math.random() * (cursed.length))];
				
				// Then we pass this playlist into our list reader
				ytlist(ytPlaylist, 'url').then(res => {
					//console.log(res.data.playlist.length);

					// Finally we randomly select a video from select playlist
					 bot.sendMessage({
						to: channelID,
						message: res.data.playlist[Math.floor(Math.random() * (res.data.playlist.length))]
						});	 
				});
				break;
			
				case 'REEEE':
				bot.sendMessage({
						to: channelID,
						message: "REEEE \n" + "https://www.youtube.com/watch?v=ifDs46V40sk" 
					});
				break;
         }
     }
});
