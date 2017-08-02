
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

app.delete('/shopping-list/:id',(req,res)=>{
  ShoppingList.delete(req.params.id);
  res.json({alert:`Shopping list ${req.params.id} deleted.`});
  res.status(204).end();
  
})

app.put('/shopping-list/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    console.log('here');
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).end();
});



app.get('/recipe',function(req,res){
	res.json(Recipes.get());
})

app.post('/recipe',function(req,res){
  console.log(req);
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

app.delete('/recipe/:id',(req,res)=>{
  Recipes.delete(req.params.id);
  res.json({alert:`Shopping list ${req.params.id} deleted.`});
  res.status(204).end();
  
})

app.put('/recipe/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    console.log('here');
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });
  res.status(204).end();
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
