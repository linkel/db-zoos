const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// POST

server.post('/api/zoos', (req, res) => {
  const zoo = req.body;
  if (!zoo.name) {
    res.status(500).json({error: "Please provide a name."});
  } else {
    db.insert(zoo)
    .into('zoos')
    .then(ids => {
      res.status(201).json(ids[0]);
    })
    .catch(err => {
      res.status(500).json({error: "Failed to post to db."});
    })
  }
})

server.get('/api/zoos', (req, res) => {
  db.select().table('zoos')
  .then(response => {
    res.status(200).json(response)
  })
  .catch(err => res.status(500).json({error : "Could not get from db"}))
})

server.get('/api/zoos/:id', (req, res) => {
  const id = req.params.id;
  db.select().table('zoos').where("id", id)
  .then(response => {
    if (response.length < 1) {
      res.status(404).json({error: "ID does not exist."})
    } else {
      res.status(200).json(response)
    }
  })
  .catch(err => res.status(500).json({error : "Could not complete GET from db."}))
})

server.delete('/api/zoos/:id', (req, res) => {
  const id = req.params.id;
  db('zoos').where("id", id).del()
  .then(response => {
    if (response < 1) {
      res.status(404).json({message : `ID ${id} doesn't exist!`})
    } else {
      res.status(200).json({message: `Successfully deleted zoo with ID${id}`})
    }
  })
  .catch(err => {
    res.status(500).json({error: "Could not delete from db"})
  })
})

server.put('/api/zoos', (req, res) => {
  const zoo = req.body;
  if (!zoo.name) {
    res.status(500).json({error: "Please provide a name."});
  } else {
    db('zoo').where("id",id).update('name',zoo.name)
    .then(updated => {
      if (updated.length < 1){
        res.status(404).json({error: `This ID ${id} does not exist!`})
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(err => {
      res.status(500).json({error: "Failed to update DB."});
    })
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
