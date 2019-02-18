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
      res.status(500).json(err);
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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
