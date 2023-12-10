const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
let app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(session({
	secret: 'some super secret here like its so secret yall can never know',
	resave: true,
	saveUninitialized: true
}));

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
	isArtist: Boolean,
    following: {
        type: Object,
        default: {}
    }
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

app.post('/login', async function(req, res) {
	let response = req.body;
	//check if user is real
	let existingUser = await user.findOne({ userName: response.userName });

	if (!existingUser) {
		//no user
		res.status(401).send();
	} 
	else {
		if (existingUser.password === response.password) {
			//password is right
			req.session.user = existingUser;
			res.status(200).send();
		} 
		else {
			//password is not right
			res.status(401).send();
		}
	}
});

app.post('/users', async function(req, res) {
	let response = req.body;
	response.isArtist = false;
	// Check if a user with the given userName already exists
	let existingUser = await user.findOne({ userName: response.userName });

	if (!existingUser) {
		//user does not existed
		let newUser = new user(response);
		await newUser.save();
		res.status(201).send();
	} 
	else {
		res.status(409).send();
	}
});

app.get('/home', async function(req, res) {
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
	} 
	else {
		//get all art and show it to the user
		let allArt = await Art.find({});
		let user = req.session.user;
		console.log(allArt);
		res.render('Home.pug', { allArt: allArt, user: user });
	}
});





