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
	"cursed",
	"roll d(100, 20, 10, 8, 6, 4 or 2)",
	"day15"
];

bot.on('ready', function (evt) {
	logger.info('Connected moon2Dab');
    /*logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')'); */
});

// Day 15 
var day15 = [
	"https://www.youtube.com/watch?v=bUvZRjl2VqU",
	"https://i.imgur.com/F7HP2Dd.png            ",
	"https://www.youtube.com/watch?v=bUvZRjl2VqU",
	"https://www.youtube.com/watch?v=FlBWzgAK0D8",
	"https://i.imgur.com/F7HP2Dd.png            ",
	"https://www.youtube.com/watch?v=bUvZRjl2VqU",
	"https://i.imgur.com/F7HP2Dd.png            ",
];

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
        //args = args.splice(1);
		
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
				
				
			case 'roll':
			case 'Roll':
			case 'r':
				var rollNum = '';

				if(args.length > 1)
				{
					rollNum = args[1];	
				}	
				
				if(rollNum)
				{
					switch(rollNum)
					{
						case "d100":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 100) + 1)
							});
							break;
						case "d20":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 20) + 1)
							});
							break;
						case "d12":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 12) + 1)
							});
							break;
						case "d10":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 10) + 1)
							});
							break;
						case "d8":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 8) + 1)
							});
							break;
						case "d6":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 6) + 1)
							});
							break;
						case "d4":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 4) + 1)
							});						
							break;
						case "d2":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a " + (Math.floor(Math.random() * 2) + 1)
							});					
							break;
						case "d1":
							bot.sendMessage({
								to: channelID,
								message: user + " rolled a 1. Are you dumb?"
							});					
							break;								
						default:
							bot.sendMessage({
								to: channelID,
									message: "Sorry, that dice is not available with this command..."
								});
							break;
					}				
				}
				else 
				{
					bot.sendMessage({
						to: channelID,
							message: "You need to add a dice value to the command. Try adding d100, d20, d10, etc. to the !Roll command."
						});
				}
				
			break;		
				
			case 'day15':
			var d = new Date();
			
			if(d.getDate() == 15)
			{			
				bot.sendMessage({
					to: channelID,
					message: "DAY 15; GIVE IT UP FOR DAY 15!!! \n" + day15[Math.floor(Math.random() * (day15.length))]
				});
			}
			else 
			{
				bot.sendMessage({
					to: channelID,
					message: "Is it day 15? \n" + "https://www.youtube.com/watch?v=gvdf5n-zI14" 
				});	
			}
				
			break;
			
			
			case 'spam':
				var vType = '';
				var vCount = 0;

				if(args.length > 2)
				{
					vType = args[1];
					vCount = args[2];
				}	
				else 
				{
					
					
				}
				
				if(vCount)
				{
					if(isNaN(vCount))
					{
						bot.sendMessage({
							to: channelID,
							message: "The count value you provided is not a valid number"
							});	
						return;
					}
				}
				
				var count = parseInt(vCount, 10);
				
				if(count <= 0 || count >= 100)
				{
					bot.sendMessage({
							to: channelID,
							message: "I could not process this command. Your value is either 0, negative or a value higher than the max (100)"
							});	
						return;
				}
				
				//logger.info(emoteType + 'is the emote id');
				var msg = "";
				
				var i;
				for(i = 0; i < count; i++)
				{
					msg += ' ' + vType;
				}
				
				logger.info(msg.length + 'is the text length');
				
				if(msg.length > 2000)
				{
					bot.sendMessage({
						to: channelID,
						message: "I could not process this command because your message exceeded the text limit."
					});			
				}
				else 
				{
					bot.sendMessage({
						to: channelID,
						message: msg
					});
				}	
			break;
		}
     }
});
