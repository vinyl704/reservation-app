const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */

const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}
function validDate(req, res, next) {
  const { data = {} } = req.body;
  if (!data["reservation_date"].match(/\d{4}-\d{2}-\d{2}/)) {
    return next({
      status: 400,
      message: `reservation_date stupid and wrong.`,
    });
  }
  if (new Date(data["reservation_date"]).getDay() + 1 === 2) {
    next({
      status: 400,
      message: `We are closed on Tuesdays, please pick a day when we are open!`,
    });
  }
  if (Date.parse(data["reservation_date"]) < Date.now()) {
    next({
      status: 400,
      message: `Reservation must be reserved for a date in the future.`,
    });
  }
  next();
}

function validTime(req, res, next) {
  const { data = {} } = req.body;
  if (!data["reservation_time"].match(/[0-9]{2}:[0-9]{2}/)) {
    return next({
      status: 400,
      message: `reservation_time wrong`,
    });
  }
  let time = Number(data.reservation_time.replace(":",""))
  if(time <  1030){
    next({ status: 400, message: "Reservation cannot be before business hours!"});
  }
  if(time > 2130){
    next({ status: 400, message: "Reservation cannot be less than one hour before business closing!"});
  }
  next()
}

function validPeople(req, res, next) {
  const { data = {} } = req.body;
  const people = data.people;

  if (typeof people != "number") {
    return next({
      status: 400,
      message: `people wrong`,
    });
  }
  next();
}
async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function exists(req,res,next){
  const {reservation_id} = req.params
  const data = await service.read(reservation_id);
  console.log("exists middleware: ",data)
  if(!data){
    return next({status:404,message:`uhhh no: ${reservation_id}`})
  }

  return next()
}

async function read(req,res){
  const {reservation_id} = req.params
  const data = await service.read(reservation_id);
  res.json({data})
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(validTime),
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(create),
  ],
  read:[asyncErrorBoundary(exists),asyncErrorBoundary(read)]
};
