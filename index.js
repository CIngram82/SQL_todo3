const express = require('express');
const server = express();
const Sequelize = require('sequelize');
const mustache = require('mustache-express');
const bodyparse = require('body-parser');
server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');

server.use(bodyparse.urlencoded({
  extended: false
}));


//// Schema

const db = new Sequelize('todolist', 'Chris', '', {
  dialect: 'postgres',
});

const Todo = db.define('todo', {
  item: Sequelize.STRING,
  completed: Sequelize.BOOLEAN,
});

Todo.sync().then(function() {
  console.log("Todo kill N'sync");
});

//// End Schema



server.get('/', function(req, res) {
  Todo.findAll({order:['createdAt']}).then(function(todos) {
    res.render('todolist', {
      todolist: todos,
    });
  });
});



server.post('/addItem', function(req, res) {
  Todo.create({
    item: req.body.item,
    completed: false,
  }).then(function() {
    res.redirect('/');
  });
});

server.post('/mark/:id', function(req, res) {
  const id = parseInt(req.params.id);
  Todo.update({
      completed: true
    }, {
      where: {
        id: id
      }
    })
    .then(function() {
      res.redirect('/');
    });
});

server.post('/remove/:id', function(req, res) {
  const id = parseInt(req.params.id);
  Todo.destroy({where: {
      id: id
    }
  }).then(function() {
    res.redirect('/');
  });
});

server.post('/removeCompleted', function(req, res) {
  Todo.destroy({
    where: {
      completed: true
    }
  }).then(function() {
    res.redirect('/');
  });
});

server.post('/goToEdit/:id', function(req,res){ // load new page to get the new text?
  const id = parseInt(req.params.id);
  Todo.find({where: {id:id}})
    .then(function(todoItem){
      res.render('edit',{
        editItem: todoItem
    });
  });
});

server.post('/makeEdit',function(req,res){
  const id = parseInt(req.body.id);
  console.log(req.body.name);
  Todo.update({item: req.body.name},{where: {id:id}})
  .then(function(){
    res.redirect('/');
  });
});

server.listen(3000);
