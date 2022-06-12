import Reservation from "./Reservation"
export default function Reservations({reservations}){

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
          {reservations.map(reservation => <Reservation key={reservation.reservation_id} reservation={reservation}/>)}
        </tbody>
      </table>)
}