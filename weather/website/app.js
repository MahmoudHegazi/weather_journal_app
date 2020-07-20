// Please note I use normal notepad to write this app (0 code editor, 2% version control)
// I used adobe animation format code feature to fix the code look and spaces
const comment_database = [];

/* Global Variables */
/* auto */
const acountry = document.getElementById("auto_country");
const acity = document.getElementById("auto_city");
const atemp = document.getElementById("auto_temp");

/* normal global */
const mytemp = document.getElementById("temp");
const mydate = document.getElementById("date");
const entery = document.getElementById("content");
const feeling = document.getElementById("feelings");
let user_zip = document.getElementById("zip");
let rec_country = document.getElementById("recent_country");

const mybutton = document.getElementById("generate");
const img = document.getElementById("mimage");
const img_text = document.getElementById("image_country");
const comment_cont = document.getElementById("comments");
let sunny = "msun.gif";
let msunny = "sun.gif";
let mcold = "vcold.gif";
let vcold = "cold.gif";

let current_img = "";
let current_country = "";

let wether = 'http://api.openweathermap.org/data/2.5/weather?id=3245&appid=db6608063a9d72758e29ea323da07bd1';
//link for auto geo
let geo = 'https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

let settings = {
	method: "Get"
};

//geo 
function xd(url, country, city) {

	fetch(url, settings)
		.then(res => res.json())
		.then((json) => {
			atemp.innerText = json.main['temp'];
			acountry.innerText = country;
			acity.innerText = city;

			if (json.main['temp'] >= 296) {
				//img.src = sunny;
				current_img = sunny;
				current_country = city;
				img.src = current_img;
				img_text.innerText = current_country;
				
			} else if (json.main['temp'] >= 285) {
				img.src = msunny;
				current_img = msunny;
				current_country = country;
				img_text.innerText = current_country;
				
			} else if (json.main['temp'] >= 270) {
				img.src = mcold;
				current_img = mcold;
				current_country = country;
				img_text.innerText = current_country;
				
			} else if (json.main['temp'] < 270) {
				current_img = vcold;
				current_country = country;
				img.src = current_img;
				img_text.innerText = current_country;
				
			} else {
				console.log('Error: Temp is Not number');
			}

		});
};



fetch(geo, settings)
	.then(res => res.json())
	.then((json) => {
		let x = "http://api.openweathermap.org/data/2.5/weather?lat=" + json.latitude + "&lon=" + json.longitude + "&appid=db6608063a9d72758e29ea323da07bd1";
		let country = json.country_name;
		let city = json.city;
		xd(x, country, city);
	});



mybutton.addEventListener("click", myapp);

function myapp() {
        postData('/comment', {content:feeling.value});

       if (feeling.value != '') {
        //show comments during session not from database I need something like jinja2 to make it
        var btn = document.createElement("div");
        var text = document.createTextNode(feeling.value);
        btn.appendChild(text);
        btn.className = "comment";
        comment_cont.appendChild(btn);
       }
	let url = "http://api.openweathermap.org/data/2.5/weather?zip=" + user_zip.value + "&appid=db6608063a9d72758e29ea323da07bd1";
	if (user_zip.value != "") {
		fetch(url, settings)
			.then(res => res.json())
			.then((json) => {

				try {
					mytemp.innerText = json.main['temp'];
					rec_country.innerText = json.sys['country'];
					current_country = json.name;
					img_text.innerText = current_country;
					//show date
					mydate.innerText = newDate;
					//show image according to wether
					if (json.main['temp'] >= 296) {
						img.src = sunny;

					} else if (json.main['temp'] >= 296) {
						img.src = msunny;

					} else if (json.main['temp'] >= 280) {
						img.src = mcold;

					} else if (json.main['temp'] < 280) {
						img.src = vcold;

					} else {
						console.log(json.main['temp']);
					}
					//error handle
				} catch (err) {
					console.log(err);
					alert('Please Enter A valid Zip Code');
					//best thing add this error or any one to database using post
				}

			});
	} else {
		alert('You Must Add ZIP Code');
	}
//getcontent();
// call get request to get the last comment This server awesome
showcomment();
}


const postData = async(url = '', data = {}) => {
	console.log(data);
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		// Body data type must match "Content-Type" header
		body: JSON.stringify(data),
	});

	try {
		const newData = await response.json();
		console.log(newData);
		return newData;
	} catch (error) {
		console.log("error", error);
	}
}




function showcomment() {
	fetch('/lastcomment', settings)
		.then(res => res.json())
		.then((json) => {
			entery.innerText = json.content;


		});
}