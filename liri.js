// .env module
require("dotenv").config()

var keys = require("./keys.js");

// Store all arguments in an array
var nodeArgs = process.argv;

// Command input
var command = process.argv[2];

// User input/search term
var input = "";

// Looping through the node argument to get everything after the 2nd index
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    input = input + "+" + nodeArgs[i];
  } else {
    input = input + nodeArgs[i];
  }
}

// Switch operation to determine which command to run
switch (command) {
    case "my-tweets":
      printTweets();
      break;
  
    case "spotify-this-song":
      printSong();
      break;
  
    case "movie-this":
      printMovie();
      break;
  
    case "do-what-it-says":
      printDWIS();
      break;
  }

// -----------------------------------------------------------------------
// Twitter
function printTweets () {
  // NPM module for reading and writing files
  var fs = require("fs");

  // Loading Twitter package
  var Twitter = require("twitter");

  // Twitter call to pass Twitter Keys
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: input,
    count: 20
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if(!error) {
      console.log("---------------------------------------------" + "\nMost recent Tweets\n" + "---------------------------------------------");
    
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text + "\n (" + tweets[i].created_at + ")\n");
      }
    }
  });
}

// -----------------------------------------------------------------------
// Spotify
function printSong () {


  if (input != false) {
    // Loading Spotify package
    var Spotify = require("node-spotify-api");
    
    // Spotify call to pass Spotify Keys
    var spotify = new Spotify(keys.spotify);

    spotify.search ({
      type: "track",
      query: input + "&limit=1&"
    }, function(error, data) {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      // Pushing out "data"
      console.log("---------------------------------------------" + "\nHere is the info you requested about the song " + input + "\n---------------------------------------------\n" + "Title: " + data.tracks.items[0].name + "\nArtist: " + data.tracks.items[0].artists[0].name + "\nPreview URL: " + data.tracks.items[0].preview_url + "\n---------------------------------------------");
    });
  } else {
    {
      var Spotify = require("node-spotify-api");
    
      // Spotify call to pass Spotify Keys
      var spotify = new Spotify(keys.spotify);

      spotify.search ({
        type:"track",
        query: "ace+of+base+sign" + "&limit=1&"
      }, function (error, data) {
        if (error) {
          console.log("Error: " + error);
          return;
        }
        // Pushing out "data"
        console.log("---------------------------------------------" + "\nSince you didn't enter a song, check out this one: " + input + "\n---------------------------------------------\n" + "Title: " + data.tracks.items[0].name + "\nArtist: " + data.tracks.items[0].artists[0].name + "\nPreview URL: " + data.tracks.items[0].preview_url + "\n---------------------------------------------");
      });
    }
  }
}

// -----------------------------------------------------------------------
// OMDB API
function printMovie() {

  var request = require("request");

  // Running request to the OMDB API
  var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    if (input != false) {
      // Parsing the body of the site to return data
      console.log("---------------------------------------------" + "\nMovie Title: " + JSON.parse(body).Title + "\nReleased : " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry Produced: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +  "\nActors: " + JSON.parse(body).Actors + "\n---------------------------------------------");
    } else {
      request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
        console.log("---------------------------------------------" + "\nMovie Title: " + JSON.parse(body).Title + "\nReleased : " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry Produced: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +  "\nActors: " + JSON.parse(body).Actors + "\n---------------------------------------------");
      });
    }
  });
}

// -----------------------------------------------------------------------
// Do what it says
function printDWIS() {
  // NPM module to read the random.txt file
  var fs = require("fs");

  // Reading info from the random.txt file
  fs.readFile("random.txt", "utf8", function(error, data){
    // Splitting the information inside the file
    var randomArray = data.split(",");

			// Sets action to first item in array.
			command = randomArray[0];

			// Sets optional third argument to second item in array.
			input = randomArray[1];

			// Calls main controller to do something based on action and argument.
			printSong(command, input);
  });
}