import React, { useEffect, useState } from "react";
import { listReservations, getTables, finishReservation } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import { useHistory } from "react-router";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const dateQuery = query.get("date");
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);
  const [tables, setTables] = useState([]);
  useEffect(loadDashboard, [pageDate, date]);
  
  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
    getTables(abortController.signal)
    .then(setTables)
    .catch(console.log);
    return () => abortController.abort();
  }
  const history = useHistory();

  const nextDateHandler = () => {
    setPageDate(() => next(pageDate));

    history.push(`/dashboard?date=${next(pageDate)}`);
  };

  const previousDateHandler = () => {
    setPageDate(() => previous(pageDate));
    history.push(`/dashboard?date=${previous(pageDate)}`);
  };

  const todayHandler = () => {
    setPageDate(() => today());
    history.push(`/dashboard?date=${today()}`);
  };

  const finishHandler = async ({table}) =>{
    //console.log("finish handler: ", table, table.table_id)
    const ac = new AbortController()
    const signal = ac.signal
    try {
      await finishReservation(table.table_id,signal)
    } catch (error) {
      console.log(error)
    }
    return ()=> ac.abort()
  }
  
  const FinishButton = (table) => (
    <button 
    data-table-id-finish={table.table_id}
    onClick={()=>finishHandler(table)}>
      Finish
      </button>
  );
  const tableElement = (
    <>
      {tables.map((table) => (
        <tr key={table.table_id}>
          <td>{table.table_id}</td>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td data-table-id-status={`${table.table_id}`}>{table.reservation_id ? "Occupied" : "Free"}</td>
          <td>{table.reservation_id && <FinishButton table={table} />}</td>
        </tr>
      ))}
    </>
  );

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
        <div className="btn-group">
          <button onClick={previousDateHandler} name="previous" className="btn">
            Previous Day
          </button>
          <button onClick={todayHandler} name="today" className="btn">
            Today
          </button>
          <button onClick={nextDateHandler} name="next" className="btn">
            Next Day
          </button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>PHONE</th>
            <th>DATE</th>
            <th>TIME</th>
            <th>PEOPLE</th>
            <th>STATUS</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            const {
              reservation_id,
              first_name,
              last_name,
              mobile_number,
              reservation_date,
              reservation_time,
              people,
              status = "booked",
            } = reservation;
            return (
              <tr key={reservation_id}>
                <td>{reservation_id}</td>
                <td>
                  {first_name} {last_name}
                </td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td>{status}</td>
                <td>
                  {status === "booked" && (
                    <a className="btn btn-secondary" href={`/reservations/${reservation_id}/seat`}>Seat</a>
                  )}
                </td>
                <td>
                  <button className="btn btn-primary">Edit</button>
                </td>
                <td>
                  <button className="btn btn-danger">Cancel</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>CAPACITY</th>
            <th>FREE?</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>{tableElement}</tbody>
      </table>
    </main>
  );
}

export default Dashboard;
