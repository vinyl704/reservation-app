const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function list(req,res,next){
    const data = await service.list();
    return res.json({data});
}

async function read(req,res,next){
    const { table_id } = req.params
    const data = await service.read(table_id)
    return res.json({data})
}

async function create(req,res,next){
    const data = await service.create(req.body.data)
    res.status(201).json({data})
}

async function update(req,res,next){
    const { reservation_id } = req.body
    const { table_id } = req.params
    const data = await service.update(table_id,reservation_id)
    res.json({data})
}

module.exports = {
    list:asyncErrorBoundary(list),
    read:asyncErrorBoundary(read),
    create:asyncErrorBoundary(create),
    update:asyncErrorBoundary(update)
}