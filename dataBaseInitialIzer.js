const fs = require("fs");
const mongoose = require('mongoose');


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
    await mongoose.connection.close();
}

main().catch(err => console.log(err));

async function loadData(){
	let jsonString = fs.readFileSync("gallery.json", "utf8");
    let jsonData = JSON.parse(jsonString);

	for (let i = 0; i < jsonData.length; i++) {
		let artData = jsonData[i];	
        let artInstance = new Art(artData);
        await artInstance.save();
	}
}