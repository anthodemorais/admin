const express = require('express'),
    bodyParser = require('body-parser'),
    filmsRouter = require('./routes/films');
    genresRouter = require('./routes/genres');
    distributeursRouter = require('./routes/distributeurs');

const app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.set('view engine', 'ejs');

app.use((request, response, next) => {
    request.io = io
    next()
})

app.use(express.static('public'));
app.use(bodyParser.json())

app.use(filmsRouter)
app.use(genresRouter)
app.use(distributeursRouter)

server.listen(3000);