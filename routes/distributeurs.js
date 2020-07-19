const express = require('express'),
      router = express.Router()
let { sequelize, Distributeur } = require('../database');

router.get('/distributeur', (request, response) => {

    let page = parseInt(request.query.page);
    let limit = parseInt(request.query.limit);
    let order = request.query.order;

    page = page != undefined && !isNaN(page) ? page : 1
    limit = limit != undefined && !isNaN(limit) ? limit : 20
    order = order ? order : "id_distributeur"
    
    Distributeur.findAndCountAll({
        order: [order]
    })
    .then(result => {
        response.render('distributeur', {
            distributeurs: result.rows,
            count: result.count,
            limit: limit,
            order: order,
            page: page
        });
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.get('/distributeur/:id', (request, response) => {
    var id_distributeur = parseInt(request.params.id)

    if (!id_distributeur || isNaN(id_distributeur)) {
        response.status(500).send("Error")
    }

    sequelize.query(`SELECT * FROM distributeurs WHERE id_distributeur=${id_distributeur}`)
    .then(result => {
        response.render('distributeurDetail', {
            distributeur: result[0][0],
        });
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.put('/distributeur/:id', (request, response) => {
    var id_distributeur = parseInt(request.params.id)

    if (!id_distributeur || isNaN(id_distributeur)) {
        response.status(500).send("Error")
    }

    var sqlValues = []
    var fields = []
    var replacements = []

    var columns = ["id_distributeur", "nom", "telephone", "adresse", "cpostal", "ville", "pays"]

    columns.forEach(element => {
        if (request.body[element] && request.body[element] != "") {
            sqlValues.push(`${element}=?`)
            fields.push(element)
            replacements.push(request.body[element])
        }
    });

    sequelize.query(`UPDATE distributeurs SET ${sqlValues.join(", ")} WHERE id_distributeur=${id_distributeur}`, {
        replacements: replacements
    })
    .then(result => {
        request.io.sockets.emit('distributeur', {
            type: "updated",
            id_distributeur: id_distributeur,
            fields: fields,
            values: request.body
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

router.delete('/distributeur/:id', (request, response) => {
    var id_distributeur = parseInt(request.params.id)

    if (!id_distributeur || isNaN(id_distributeur)) {
        response.status(500).send("Error")
    }

    Distributeur.destroy({
        where: {
            id_distributeur: id_distributeur
        }
    })
    .then(result => {
        request.io.sockets.emit('distributeur', {
            type: "deleted",
            id_distributeur: id_distributeur
        })
    })
    .catch(err => { console.log(err); response.status(500).send("Error") })
    .finally(err => response.status(500).send("Error"))
})

module.exports = router