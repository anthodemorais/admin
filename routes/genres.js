const express = require('express'),
      router = express.Router()
let { sequelize, Genre } = require('../database');

router.get('/genre', (request, response) => {

    let page = parseInt(request.query.page);
    let limit = parseInt(request.query.limit);
    let order = request.query.order;

    page = page != undefined && !isNaN(page) ? page : 1
    limit = limit != undefined && !isNaN(limit) ? limit : 20
    order = order ? order : "id_genre"
    
    Genre.findAndCountAll({})
    .then(result => {
        response.render('genre', {
            genres: result.rows,
            count: result.count,
            limit: limit,
            order: order,
            page: page
        });
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.get('/genre/:id', (request, response) => {
    var id_genre = parseInt(request.params.id)

    if (!id_genre || isNaN(id_genre)) {
        response.status(500).send("Error")
    }

    sequelize.query(`SELECT * FROM genres WHERE id_genre=${id_genre}`)
    .then(result => {
        response.render('genreDetail', {
            genre: result[0][0],
        });
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.put('/genre/:id', (request, response) => {
    var id_genre = parseInt(request.params.id)

    if (!id_genre || isNaN(id_genre)) {
        response.status(500).send("Error")
    }

    var sqlValues = []
    var fields = []

    var replacements = []

    var columns = ["id_genre", "nom"]

    columns.forEach(element => {
        if (request.body[element] && request.body[element] != "") {
            sqlValues.push(`${element}=?`)
            fields.push(element)
            replacements.push(request.body[element])
        }
    });

    sequelize.query(`UPDATE genres SET ${sqlValues.join(", ")} WHERE id_genre=${id_genre}`, {
        replacements: replacements
    })
    .then(result => {
        request.io.sockets.emit('genre', {
            type: "updated",
            id_genre: id_genre,
            fields: fields,
            values: request.body
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.delete('/genre/:id', (request, response) => {
    var id_genre = parseInt(request.params.id)

    if (!id_genre || isNaN(id_genre)) {
        response.status(500).send("Error")
    }

    Genre.destroy({
        where: {
            id_genre: id_genre
        }
    })
    .then(result => {
        request.io.sockets.emit('genre', {
            type: "deleted",
            id_genre: id_genre
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

module.exports = router