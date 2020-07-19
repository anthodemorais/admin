const express = require('express'),
      router = express.Router()
let { sequelize, Film } = require('../database');

var liveFilm = undefined

router.get('/', (request, response) => {

    let page = parseInt(request.query.page);
    let limit = parseInt(request.query.limit);
    let order = request.query.order;

    page = page != undefined && !isNaN(page) ? page : 1
    limit = limit != undefined && !isNaN(limit) ? limit : 20
    order = order ? order : "id_film"
    
    sequelize.query("SELECT f.*, g.nom AS genre, d.nom as distrib FROM films AS f INNER JOIN genres g ON f.id_genre=g.id_genre INNER JOIN distributeurs d ON f.id_distributeur=d.id_distributeur ORDER BY " + order)
    .then(result => {
        count = result[0].length
        response.render('film', {
            films: result[0],
            count: count,
            limit: limit,
            order: order,
            page: page
        });
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.get('/film/live', (request, response) => {
    if (liveFilm != undefined) {
        sequelize.query(`SELECT f.*, g.nom AS genre, d.nom as distrib FROM films AS f INNER JOIN genres g ON f.id_genre=g.id_genre INNER JOIN distributeurs d ON f.id_distributeur=d.id_distributeur WHERE id_film=${liveFilm}`)
        .then(result => {
            response.render('filmDetail', {
                film: result[0][0],
            });
        })
        .catch(err => { console.log(err); response.status(500).send("Error") })
        .finally(err => response.status(500).send("Error"))
    }
    else {
        response.status(404).send("Not found")
    }
})

router.put('/film/live', (request, response) => {
    var id_film = parseInt(request.body.id)

    if (!id_film || isNaN(id_film)) {
        response.status(500).send("Error")
    }

    liveFilm = id_film

    sequelize.query(`SELECT f.*, g.nom AS genre, d.nom as distrib FROM films AS f INNER JOIN genres g ON f.id_genre=g.id_genre INNER JOIN distributeurs d ON f.id_distributeur=d.id_distributeur WHERE id_film=${liveFilm}`)
    .then(result => {
        request.io.sockets.emit('film', {
            type: "live",
            film: result[0][0],
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.get('/film/:id', (request, response) => {
    var id_film = parseInt(request.params.id)

    if (!id_film || isNaN(id_film)) {
        response.status(500).send("Error")
    }

    sequelize.query(`SELECT f.*, g.nom AS genre, d.nom as distrib FROM films AS f INNER JOIN genres g ON f.id_genre=g.id_genre INNER JOIN distributeurs d ON f.id_distributeur=d.id_distributeur WHERE id_film=${id_film}`)
    .then(result => {
        response.render('filmDetail', {
            film: result[0][0],
        });
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.put('/film/:id', (request, response) => {
    var id_film = parseInt(request.params.id)

    if (!id_film || isNaN(id_film)) {
        response.status(500).send("Error")
    }

    var sqlValues = []
    var fields = []
    var replacements = []

    var columns = ["titre", "resum", "id_genre", "id_distributeur", "date_debut_affiche", "date_fin_affiche", "duree_minutes", "annee_production"]

    columns.forEach(element => {
        if (request.body[element] && request.body[element] != "") {
            sqlValues.push(`${element}=?`)
            fields.push(element)
            replacements.push(request.body[element])
        }
    });

    sequelize.query(`UPDATE films SET ${sqlValues.join(", ")} WHERE id_film=${id_film}`, {
        replacements: replacements
    })
    .then(result => {
        request.io.sockets.emit('film', {
            type: "updated",
            id_film: id_film,
            fields: fields,
            values: request.body
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.delete('/film/:id', (request, response) => {
    var id_film = parseInt(request.params.id)

    if (!id_film || isNaN(id_film)) {
        response.status(500).send("Error")
    }

    Film.destroy({
        where: {
            id_film: id_film
        }
    })
    .then(result => {
        request.io.sockets.emit('film', {
            type: "deleted",
            id_film: id_film
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

module.exports = router



// router.get('/film/new', (request, response) => {
//     response.render('newFilm')
// })

// router.post('/film/new', (request, response) => {
//     var columns = ["titre", "resum", "id_genre", "id_distributeur", "date_debut_affiche", "date_fin_affiche", "duree_minutes", "annee_production"]
//     var numbers = ["id_genre",  "id_distributeur", "duree_minutes", "annee_production"]
//     var dates = ["date_debut_affiche", "date_fin_affiche"]

//     var replacements = []

//     columns.forEach(element => {
//         if (request.body[element] && request.body[element] != "") {
//             if (numbers.includes(element) && isNaN(request.body[element])) {
//                 response.status(500).send("Error")
//             }
//             else if (dates.includes(element) && isNaN(Date.parse(request.body[element]))) {
//                 response.status(500).send("Error")
//             }
//             else {
//                 if (!dates.includes(element)) {
//                     replacements.push(request.body[element])
//                 }
//             }
//         }
//     });

//     sequelize.query(`INSERT INTO films(${columns.join(", ")}) VALUES (?, ?, ?, ?, '${request.body["date_debut_affiche"]}', '${request.body["date_fin_affiche"]}', ?, ?)`, {
//         replacements: replacements
//     })
//     .then(result => {
//         request.io.sockets.emit('film', {
//             type: "created",
//         })
//     })
//     .catch(err => { console.log(err); response.status(500).send("Error") })
//     .finally(err => response.status(500).send("Error"))

// })