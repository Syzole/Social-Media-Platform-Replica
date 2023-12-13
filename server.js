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
        type: Array,
		default: []
    },
	followers: {
		type: Array,
		default: []
	},
	notifications: {
		type: Array,
		default: []
	}
});

const artSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Year: {
		type: Number,
		required: true
	},
	Category: String,
	Medium: String,
	Description: String,
	Poster: String,
	isLikedBy:{
		type: Array,
		default: []
	},
	reviews:{
		type: Object,
		default: {}
	}
});

const workshopSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Description: String,
	Enrolled: {
		type: Array,
		default: []
	}
});

let Art = mongoose.model("Art",artSchema);
let user = mongoose.model("Users",userSchema);
let Workshop = mongoose.model("Workshop",workshopSchema);

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/final');
	console.log('Connected to MongoDB');

	app.listen(3000);
	console.log("Server is chilling at http://localhost:3000/");
}

main().catch(err => console.log(err));

// app.use(function(req,res,next){
// 	console.log(req.method);
// 	console.log(req.url);
// 	console.log(req.path);
// 	console.log(req.get("Content-Type"));
// 	next();
// });



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
		newUser.following = [];
		newUser.followers = [];
		newUser.likedArt = [];
		newUser.workshops = [];
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
		//console.log(allArt);
		res.render('Home.pug', { allArt: allArt, user: user });
	}
});

app.get('/userSettings', async function(req, res) {
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
	} 
	else {
		//show the user settings page with the user session info
		let user = req.session.user;
		res.render('UserSettings.pug', { user: user });
	}
});

app.post('/changeAccountType', async function(req, res) {
	let response = req.body;
	let existingUser = await user.findOne({ userName: response.userName });
	if (!existingUser) {
		//user does not existed
		res.status(401).send();
	} 
	else {
		//user exists, change the user type
		existingUser.isArtist = !existingUser.isArtist;
		await existingUser.save();
		req.session.user = existingUser;
		res.status(200).send();
	}
	
});

app.post('/updateLike', async function(req, res) {
	let response = req.body;
	let existingArt = await Art.findOne({ Title: response.Title });
	if (!existingArt) {
		//art does not existed
		res.status(401).send();
	} 
	else {
		//art exists, update likes by user
		existingArt.isLikedBy = response.isLikedBy;
		await existingArt.save();
		//console.log("sending "+existingArt)
		res.status(200).json(existingArt);
	}

});

app.get('/artist/:artist', async function(req, res) {
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else {
		let artistName = req.params.artist;
		let artist = await user.findOne({ userName: artistName });
		if(!artist){
			res.status(401).send();
			return;
		}
		let allArtToArtist = await Art.find({ Artist: artistName });
		let workshopToArtist = await Workshop.find({ Artist: artistName });
		//console.log(workshopToArtist);
		let loggedIn = req.session.user;
		res.render('Artist.pug', { allArtToArtist: allArtToArtist, user: loggedIn, artist: artist, workshopToArtist: workshopToArtist });
	}
});

app.get('/search/:search/:PageNum', async function(req, res) {
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
	} 
	else {
		let search = req.params.search;
		let pageNum = req.params.PageNum;
		//search db for art contiant title , artist or cat, case insensitive
		let searchedArt = await Art.find({ $or: [ 
			{ Title: { $regex: search, $options: 'i' } }, 
			{ Artist: { $regex: search, $options: 'i' } }, 
			{ Category: { $regex: search, $options: 'i' } 
		} ] }).skip(pageNum*10).limit(10);
		let user = req.session.user;
		if(!search){
			redirect('/home');
			res.status(401).send();
			return;
		}
		//console.log(searchedArt);
		res.render('Search.pug', { searchedArt: searchedArt, user: user,pageNum: pageNum, search: search});
	}
});

app.get(`/art/:artwork`, async function(req, res) {
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
	} 
	else {
		let art = req.params.artwork;
		let artPiece = await Art.findOne({ Title: art });
		let user = req.session.user;
		if(!art){
			res.status(401).send();
			return;
		}
		res.render('Artwork.pug', { artPiece: artPiece, user: user });
	}
});

app.post('/updateReview', async function(req, res) {
	let response = req.body;
	console.log(response);
	let existingArt = await Art.findOne({ Title: response.Title });
	if (!existingArt) {
		//art does not existed
		res.status(401).send();
	} 
	else {
		//art exists, update review by user
		console.log("Before: "+existingArt.reviews[String(response.user.userName)])
		existingArt.reviews[String(response.user.userName)] = String(response.reviews);
		await Art.updateOne({Title: response.Title}, {reviews: existingArt.reviews});
		console.log("After: "+existingArt.reviews[String(response.user.userName)])
		console.log(existingArt.reviews)
		//console.log("sending "+existingArt)
		res.status(200).json(existingArt);
	}
});

app.post('/deleteReview', async function(req, res) {
	let response = req.body;
	let existingArt = await Art.findOne({ Title: response.Title });
	if (!existingArt) {
		//art does not existed
		res.status(401).send();
	} 
	else {
		//art exists, update review by user
		delete existingArt.reviews[String(response.user.userName)];
		await Art.updateOne({Title: response.Title}, {reviews: existingArt.reviews});
		//console.log("sending "+existingArt)
		res.status(200).json(existingArt);
	}
});

app.post('/updateFollowing', async function(req, res) {
	
	let response = req.body;
	let existingUser = await user.findOne({ userName: response.user.userName });
	let existingArtist = await user.findOne({ userName: response.artist.userName });
	if (!existingUser&&!existingArtist) {
		//one dosent exist
		res.status(401).send();
	} 
	else {
		//user exists, update following by user
		existingUser.following = response.user.following;
		existingArtist.followers = response.artist.followers;
		await existingUser.save();
		await existingArtist.save();
		//console.log("sending "+existingUser)
		req.session.user = existingUser;
		let data = {
			user: existingUser,
			artist: existingArtist
		}
		res.status(200).json(data);
	}
	
});

app.get('/following',async function(req,res){
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else {
		let loggedIn = req.session.user;
		let following = loggedIn.following;
		let artists = await user.find({userName: {$in: following}});
		res.render('Following.pug', { artists: artists, user: loggedIn });
	}
});


app.get('/notifications',async function(req,res){
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else {
		req.session.user = await user.findOne({ userName: req.session.user.userName });
		console.log(req.session.user.notifications);
		let loggedIn = req.session.user;
		res.render('Notifications.pug', {user: loggedIn });
	}
});

app.get('/upload',async function(req,res){
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else if(!req.session.user.isArtist){
		res.redirect('/home');
		return;
	}
	else {
		req.session.user = await user.findOne({ userName: req.session.user.userName });
		let loggedIn = req.session.user;
		res.render('AddArt.pug', { user: loggedIn });
	}
});

app.post('/addArt', async function(req, res) {
	let response = req.body;
	let newArt = new Art(response.art);
	let artist = response.user;
	
	artist.followers.forEach(user => {
		notifyUser(user, 'The artist ' + artist.userName + ' has added a new piece of art titled ' + newArt.Title + '.' );
	});

	newArt.isLikedBy = [];
	newArt.reviews = {};

	//save the updated user data to the database
	
	await newArt.save();
	res.status(201).send();
});

app.get('/createWorkshop',async function(req,res){
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else if(!req.session.user.isArtist){
		res.redirect('/home');
		return;
	}
	else {
		req.session.user = await user.findOne({ userName: req.session.user.userName });
		let loggedIn = req.session.user;
		res.render('AddWorkshop.pug', { user: loggedIn });
	}
});

app.post('/addWorkShop', async function(req, res) {
	let response = req.body;
	let data = {
		Title: response.Title,
		Artist: response.Artist.userName,
		Description: response.Description
	}

	response.Artist.followers.forEach(user => {
		notifyUser(user, 'The artist ' + data.Artist + ' has added a new workshop titled ' + data.Title + '.' );
	});

	console.log(data);

	let newWorkshop = new Workshop(data);
	newWorkshop.Enrolled = [];
	await newWorkshop.save();
	res.status(201).send();
});

app.get('/workshop/:workshopName',async function(req,res){
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else {
		let workshopName = req.params.workshopName;
		let workshop = await Workshop.findOne({ Title: workshopName });
		if(!workshop){
			res.status(401).send();
			return;
		}
		let user = req.session.user;
		res.render('Workshop.pug', { workshop: workshop, user: user });
	}
});

app.post('/updateEnrolled', async function(req, res) {
	let response = req.body;
	let existingWorkshop = await Workshop.findOne({ Title: response.Title });
	if (!existingWorkshop) {
		//it does not existed
		res.status(401).send();
	} 
	else {
		existingWorkshop.Enrolled = response.Enrolled;
		await existingWorkshop.save();
		//console.log("sending "+existingArt)
		res.status(200).json(existingWorkshop);
	}
});

app.get('/interactions',async function(req,res){
	if (!req.session.user) {
		//redirect user to login page, since the user dosent isnt logged in so they would error
		res.redirect('/');
		return;
	} 
	else {
		let loggedIn = req.session.user;
		let likedArt = await Art.find({isLikedBy: {$in: [loggedIn.userName]}});
		let reviewArt = await Art.find().where('reviews.'+loggedIn.userName).ne(null);
		res.render('Interactions.pug', { user: loggedIn, likedArt: likedArt, reviewArt: reviewArt });
	}
});

async function notifyUser(userName, notification){

	let existingUser = await user.findOne({ userName: userName });
	existingUser.notifications.push(notification);
	await existingUser.save();
}