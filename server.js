const fs = require("fs");
const mongoose = require('mongoose');
const express = require('express');
//const mc = require("mongodb").MongoClient;
let app = express();
app.use(express.static('public'));
app.use(express.json());

const userSchema = new mongoose.Schema({
	userName: String,
	password: String
});

const artSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Year: Number,
	Category: String,
	Medium: String,
	Description: String,
	Poster: String
});

let Art = mongoose.model("Art",artSchema);
let user = mongoose.model("Users",userSchema);

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/final');
        console.log('Connected to MongoDB');

        await loadData();
		console.log("data loaded");

		app.listen(3000);
		console.log("Server is chilling at http://localhost:3000/");
    } 
	catch (error) {
        console.error('Ayo we got some kind of problem:' + error.message);
    }
}

main().catch(err => console.log(err));

app.use(function(req,res,next){
	console.log(req.method);
	console.log(req.url);
	console.log(req.path);
	console.log(req.get("Content-Type"));
	next();
});



app.get('/', function(req, res) {
    res.render('Login.pug');
});

app.get('/signup', function(req, res) {
    res.render('Sign.pug');
});

app.post('/users',function(req,res){
	//TODO: fix this
	let existingUser = Users.findOne({ Poster: artData.Poster });
	if(!existingUser){

	}
	else{
		
	}
});


async function loadData(){
	let jsonString = fs.readFileSync("gallery.json", "utf8");
    let jsonData = JSON.parse(jsonString);

	for (let i = 0; i < jsonData.length; i++) {
		let artData = jsonData[i];	
		let existingArtwork = await Art.findOne({ Poster: artData.Poster });

		if (!existingArtwork) {
			let artInstance = new Art(artData);
			await artInstance.save();
			//console.log("Artwork added:", artData.Title);
		}
		else{
			//console.log(artData.Title + " Is a dupe")
		}
	}
}

