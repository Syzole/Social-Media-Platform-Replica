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
	await mongoose.connect('mongodb://127.0.0.1:27017/final');
	console.log('Connected to MongoDB');

	await loadData();
	console.log("data loaded");

	app.listen(3000);
	console.log("Server is chilling at http://localhost:3000/");
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

app.post('/users', async function(req, res) {
	let { userName, password } = req.body;

	// Check if a user with the given userName already exists
	let existingUser = await user.findOne({ userName: userName });

	if (!existingUser) {
		//user does not existed
		const newUser = new user({ userName, password });
		await newUser.save();
		res.status(201).send();
	} 
	else {
		res.status(409).send();
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
