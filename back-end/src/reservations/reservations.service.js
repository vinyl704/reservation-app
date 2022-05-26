const knex = require('../db/connection');

function list(date){
    return knex("reservations")
        .select("*")
        .where({"reservation_date":date})
        .orderBy("reservation_time");
}

function create(newReservation){
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(newData => newData[0])
}

function destroy(id){
    return knex("reservations")
    .where(id)
    .del()
}

module.exports = {
    list,create,destroy
}