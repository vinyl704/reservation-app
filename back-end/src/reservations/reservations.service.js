const knex = require('../db/connection');

function list(date){
    //console.log("date: ",date)
    return knex("reservations")
        .select("*")
        .where({"reservation_date":date})
        .andWhereNot({"status":"finished"})
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

function read(reservation_id){
    //console.log(reservation_id)
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first()
}

function statusUpdate(reservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id:reservation.reservation_id})
    .update({status:reservation.status},"*")
    .then(updatedReservation => updatedReservation[0])
}

function update(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id:updatedReservation.reservation_id})
    .update(updatedReservation,"*")
    .then(updated => updated[0])
}

module.exports = {
    list,create,destroy,read,update, statusUpdate
}