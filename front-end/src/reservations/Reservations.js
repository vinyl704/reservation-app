export default function Reservations({reservations}){
    const reservationsTable = reservations.map((reservation) => {
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
      })

    return(<table>
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
          {reservationsTable}
        </tbody>
      </table>)
}