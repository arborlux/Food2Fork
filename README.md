# Food2Fork

A simple node.js application that can query the Food2Fork.com API for recipe data. 

## Prerequisites

* Node.js v9.4
* Google Chrome
* A free API Key from Food2Fork. You must add your personal key to the const API_KEY in server.js for this to work.

## Install

Install dependencies with Command Prompt while open in the root project directory: 
```
npm install
```

## Launch

Launch the server on port 3000 with command:
```
npm start
```

## Running

While the server is currently running, open Chrome to any of the following URLs:
```
http://localhost:3000/recipes.html
http://localhost:3000/recipes
http://localhost:3000/index.html
http://localhost:3000/
http://localhost:3000
```

Recipe data can also be obtained though a GET request by including recipes?ingredients= in your URL. Ex:
```
http://localhost:3000/recipes?ingredients=Basil,Cumin
```

## Tested On

Application tested using Node.js v9.4.0 on Windows 10 Pro v1709 64-bit and Google Chrome v64.0.3282.186

## Author

Patrick Griffith
