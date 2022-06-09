const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const resService = require("../reservations/reservations.service");
async function list(req, res, next) {
  const data = await service.list();
  return res.json({ data });
}
async function hasData(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({ status: 400, message: "no data" });
  }
  return next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    //
    res.locals.table_id = table_id;
    return next();
  }
  //
  return next({ status: 404, message: `Table ${table_id} does not exist` });
}

function validTableName(req, res, next) {
  //
  const { data } = req.body;

  if (!data.table_name || data.table_name.length < 2) {
    return next({ status: 400, message: `table_name missing` });
  }
  return next();
}

function validCapacity(req, res, next) {
    
  if (
    req.body.data.capacity < 1 ||
    typeof req.body.data.capacity !== "number" ||
    !req.body.data.capacity
  ) {
    return next({ status: 400, message: `invalid capacity` });
  }
  return next()
}

async function hasReservationId(req, res, next) {
  if (!req.body.data.reservation_id) {
    return next({ status: 400, message: `reservation_id missing` });
  }
  return next();
}

function isTableAvailable(req, res, next) {
  if (res.locals.table.reservation_id) {
    return next({ status: 400, message: "table occupied" });
  }
  return next();
}

async function read(req, res, next) {
  const { table_id } = res.locals;
  const data = await service.read(table_id);
  return res.json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;

  const data = await resService.read(reservation_id);

  if (data) {
    res.locals.people = data.people;
    return next();
  }
  return next({ status: 404, message: `${reservation_id} does not exist` });
}

async function tableLargeEnough(req, res, next) {
  const table = res.locals.table;
  const capacity = table.capacity;
  const people = res.locals.people;
  if (people > capacity) {
    return next({
      status: 400,
      message: `Table ${table.table_id} capacity not big enough`,
    });
  }
  return next();
}

async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;

  const data = await service.update(table_id, reservation_id);
  res.json({ data });
}

async function tableOccupied(req,res,next){
    const { table_id } = req.params
    const data = await service.read(table_id)
    if(data.reservation_id){
        res.locals.table_id = table_id
        return next()
    }
    return next({status:400,message:"table not occupied"})
}

async function finish(req,res,next){
    //console.log(res.locals)
    const { table_id } = res.locals
    const data = await service.finish(table_id)
    res.json({data})
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(read)],
  create: [hasData, 
    validTableName, 
    validCapacity, 
    asyncErrorBoundary(create)],
  update: [
    hasData,
    asyncErrorBoundary(hasReservationId),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    isTableAvailable,
    asyncErrorBoundary(tableLargeEnough),
    asyncErrorBoundary(update),
  ],
  delete:[asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableOccupied),
    asyncErrorBoundary(finish)]
};
