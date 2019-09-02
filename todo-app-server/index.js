const express = require('express');
const cors = require('cors');
const monk = require('monk');
const joi = require('joi');

const app = express();
const port = process.env.PORT || 5000;

const db = monk('localhost/todoapp-db');
const todos = db.get('todos');

app.use(express.json());
app.use(cors());


const validationSchemaTodo = {
    title: joi.string().min(1).required(),
    completed: joi.boolean().required(),
    //eventDate: joi.date().required(),
}

// get all todos
app.get('/api/todos', (req, res) => {

    todos.find().then((todos) => {
        res.json(todos);
    });


});


// add a todo
app.post('/api/todos', (req, res) => {

    const validationResult = joi.validate(req.body, validationSchemaTodo);

    if (validationResult.error === null) {
        const todo = {
            title: req.body.title.toString(),
            completed: req.body.completed,
            //eventDate: req.body.eventDate,
            created: new Date()
        }

        todos.insert(todo).then((createdTodo) => {
            res.json(createdTodo);
        });

    } else {
        res.status(422);
        res.json({
            errorMessage: "Todo format incorrect !"
        });
    }

});


// delete todo
app.delete('/api/todos/:id', (req, res) => {

    todos.findOneAndDelete({ _id: req.params.id }).then((deletedTodo) => {
        res.json({
            successMessage: 'Deleted'
        });
    })

});


app.listen(port, () => {
    console.log('Listening on port ' + port);
})