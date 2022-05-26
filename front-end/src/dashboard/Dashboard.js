import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import useQuery from "../utils/useQuery"
import ErrorAlert from "../layout/ErrorAlert";
import {today,next,previous} from "../utils/date-time"
import {useHistory} from 'react-router';
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery()
  const dateQuery = query.get("date")
  const [pageDate, setPageDate] = useState(dateQuery ? dateQuery : date);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const date = pageDate;
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
 const history = useHistory();

 

  const nextDateHandler = () => {
    
    setPageDate(()=>next(pageDate));
    
    history.push(`/dashboard?date=${pageDate}`);
    loadDashboard(date = pageDate)

  };

  const previousDateHandler = () => {

   
    setPageDate(()=>previous(pageDate));
    history.push(`/dashboard?date=${pageDate}`);
  };

  const todayHandler = () => {
    setPageDate(()=>today());
    history.push(`/dashboard?date=${pageDate}`);

  };
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
        <div className="btn-group">
          <button onClick={previousDateHandler} name="previous" className="btn">Previous Day</button>
          <button onClick={todayHandler} name="today" className="btn">Today</button>
          <button onClick={nextDateHandler} name="next" className="btn">Next Day</button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
