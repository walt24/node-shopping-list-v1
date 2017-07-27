const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {ShoppingList} = require('./models');
const {Recipes} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

Recipes.create('cake',['flour', 'egg','vanilla extract'])
Recipes.create('cuba libre',['rum','coke','lemon'])

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list',(req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

app.post('/recipe',function(req,res){
	console.log(req.body);
	if(!req.body.name){
		console.log("No namme in req.body");
		res.json({"error" : "No recipe name"})
    		res.end();
	}else if(!req.body.ingredients){
		console.log("No ingredients in req.body");
		res.json({"error" : "No ingredients"})
    		res.end();
	}else{
  		var input = Recipes.create(req.body.name, req.body.ingredients);
    		res.status(201).json(input);
  }
})
app.get('/recipes',function(req,res){
	res.json(Recipes.get());
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
