export default function Reservation({reservation}){
    
      return (
        <tr key={reservation.reservation_id}>
          <td>{reservation.reservation_id}</td>
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
            <button className="btn btn-primary">Edit</button>
          </td>
          <td>
            <button className="btn btn-danger">Cancel</button>
          </td>
        </tr>
      );
}