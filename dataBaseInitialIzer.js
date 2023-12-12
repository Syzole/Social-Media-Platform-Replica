const fs = require("fs");
const mongoose = require('mongoose');


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
	likedArt: {
		type: Array,
		default: []
	},
	workshops: {
		type: Array,
		default: []
	}
});

const artSchema = new mongoose.Schema({
	Title: String,
	Artist: String,
	Year: Number,
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

let Art = mongoose.model("Art",artSchema);
let user = mongoose.model("Users",userSchema);

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/final');
	console.log('Connected to MongoDB');

	await loadData();
	console.log("data loaded");
    await mongoose.connection.close();
}

main().catch(err => console.log(err));

async function loadData(){
	let jsonString = fs.readFileSync("gallery.json", "utf8");
    let jsonData = JSON.parse(jsonString);

	//create an artist account for every artist in the gallery.json file no duplicates and add their art to their artCreated array
	for(let i = 0; i < jsonData.length; i++){
		let art = jsonData[i];
		let artist = await user.findOne({userName: art.Artist});
		if(artist === null){
			artist = new user({
				userName: art.Artist,
				password: "password",
				isArtist: true,
				following: [],
				followers: [],
				likedArt: [],
				workshops: []
			});
			await artist.save();
		}
		await artist.save();
	}

	//now add art to database and artists
	for(let i = 0; i < jsonData.length; i++){
		let art = jsonData[i];
		let artist = await user.findOne({userName: art.Artist});
		art.isLikedBy = [];
		art.reviews = {};
		art = new Art(art);
		await art.save();
	}
	
}