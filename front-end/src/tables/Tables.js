import './tables.css'
import Table from './Table'
export default function Tables({tables, FinishButton}){
   
    return(
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
        <tbody>{tables.map((table) => (
            <Table key={table.table_id} table={table}/>
            ))}</tbody>
      </table>)
}