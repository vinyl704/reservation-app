import {cancelReservation} from '../utils/api'
import { useHistory } from 'react-router'

export default function Reservation({reservation}){
  const history = useHistory();
  
  const cancelHandler = async (e) => {
    e.preventDefault();
    const conf = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (conf) {
      await cancelReservation(reservation,"cancelled");
      history.push("/");
    }
  };
      return (
        <tr key={reservation.reservation_id}>
          <th scope='row'>{reservation.reservation_id}</th>
          <td>
            {reservation.first_name} {reservation.last_name}
          </td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
           <td>
            {reservation.status === "booked" ? (
              <a className="btn btn-secondary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
            ):null}
          </td> 
          <td>
            <a href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-primary">Edit</a>
          </td>
          <td>
            <button className="btn btn-danger" onClick={cancelHandler} data-reservation-id-cancel={reservation.reservation_id}>Cancel</button>
          </td>
        </tr>
      );
}