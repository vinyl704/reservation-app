const { table } = require("../db/connection")
const knex = require("../db/connection")

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

function read(table_id){
     return knex("tables")
     .select("*")
     .where({table_id})
 }

function create(table){
    return knex("tables")
    .insert(table)
    .then(createdTable => createdTable[0])
}

function update(table_id,reservation_id){
    return knex("tables")
    .where({table_id})
    .update({reservation_id},["table_id","reservation_id"])
    //.then(updatedTable => updatedTable[0])
}

module.exports = {
    list,read,create,update
}