import React, { useEffect, useState } from "react";
import { listReservations, getTables, finishReservation } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import { useHistory } from "react-router";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
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
    .catch(setReservationsError);
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
      <Reservations className="col col-sm-12 col-6" reservations={reservations}/>
      <Tables className="col col-sm-12 col-6" tables={tables}/>
    </main>
  );
}

export default Dashboard;
