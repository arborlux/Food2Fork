// Uses the express framework to retrieve recipes based on user-submitted ingredients.

const http = require('http')
const url = require('url')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 3000 // Port the server will be listening on 
const API_KEY = 'XXXXXXXXXXXXXXXXXXXXXXX' // Need a free API Key from food2fork.com

app.use(bodyParser.urlencoded({ extended: false })); // Credit: https://github.com/expressjs/body-parser
app.use(bodyParser.json()); // Credit: https://github.com/expressjs/body-parser

function sendResponse(data, res){
  // Create an html page with a form to submit and some css to prettify the recipe data 
  var page = '<html><head><title>Assignment 4</title>' +
    '<style>' +
      'div.image  { display: block; margin-left: auto; margin-right: auto; float: left; border: 1px solid black; }' +
      'div.title  { text-align: center; }' +
      'div.recipe { margin:0 auto; text-align:center; }' +
    '</style></head>' +
    '<body>' +
      '<div class="recipe">' +
        '<form method="post">' +
          'Get Recipes With: <input name="ingredient">' +
          '<input type="submit" value="Submit">' +
        '</form><div class="title">Use commas to search for multiple ingredients at once! <br> You can also leave the input blank and hit submit for the top 30 popular recipes!</div>' +
      '</div><br>';
  // Add the recipe data to the page
  if(data) {
    console.log("inside sendResponse:");
    let dataParsed = JSON.parse(data);
    console.log(dataParsed);
    // iterate over dataParsed (count times) and display a div for each
    // (src image) image_url -> (hyperlink) source_url, (name) title  
    for (let i = 0; i < dataParsed.count; i++) {
      page += 
      '<div class="image">' +
        '<a target="_blank" href="' + dataParsed.recipes[i].source_url + '">' +
        '<img src="' + dataParsed.recipes[i].image_url + '" alt="Recipe Image" width="400" height="300"></a>' +
          '<div class="title">' + dataParsed.recipes[i].title + '</div>' +
      '</div>'; 
    }
  }
  page += '</body></html>';
  res.end(page); // Display the page
}

function parseData(serverResponse, res) {
  console.log("inside parseData:");
  let data = ''
  serverResponse.on('data', function (chunk) {
    data += chunk
  })
  serverResponse.on('end', function () {
    sendResponse(data, res);
  })
}

// Uses the Food2Fork API to request recipes. See, https://food2fork.com/about/api 
function getRecipes(ingredient, res){
    console.log("inside getRecipes: " + ingredient.replace(/ /g, "%20"));
    const options = {
      host: 'www.food2fork.com',
      path: `/api/search?key=${API_KEY}&q=${ingredient.replace(/ /g, "%20")}`
    }
    http.request(options, function(apiResponse) {
      parseData(apiResponse, res);
    }).end()
}

function handleGet(req, res) {
  let requestURL = req.url;
  let query = url.parse(requestURL).query; // check for any arguements
  // handle ingregients passed in through a GET request, ex http://localhost:3000/recipes?ingredients=Basil,Cumin
  if (query != null) {
    console.log("inside GET query: " + query);
    let str = query.substring(query.indexOf("=") + 1);
    getRecipes(str, res);
  }
  //query is null so just sendResponse with no data (will display submit form)
  else {
    console.log("inside GET no query:");
    sendResponse(null, res)
  }
}

// Handle GET requests
app.get('', (req, res) => handleGet(req, res))
app.get('/', (req, res) => handleGet(req, res))
app.get('/index.html', (req, res) => handleGet(req, res))
app.get('/recipes', (req, res) => handleGet(req, res))
app.get('/recipes.html', (req, res) => handleGet(req, res))

// Handle POST from input
app.post('*', (req, res) => {
  console.log("inside post");
  getRecipes(req.body.ingredient, res);
})

// Start the Server on PORT
app.listen(PORT, function() {
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
})