import { useState } from "react"
import { useHistory,useParams } from "react-router"
import { seatReservation } from "../utils/api"

export default function SeatReservation({tables}){
    //console.log(tables)
    const {reservation_id} = useParams()
    //console.log(reservation_id)
    const history = useHistory()
    const [tableList,setTableList] = useState([])
    tables.then(setTableList)
    //console.log(selectedTable)
    const [selectedTable,setSelectedTable] = useState(1)
    const submitHandler = async (e)=>{
        e.preventDefault();
        const ac = new AbortController();
        console.log("selectedTable: ",selectedTable)
        try {
            await seatReservation(selectedTable,reservation_id,ac.signal)
            history.push("/dashboard")
        } catch (error) {
            console.log(error)
        }
        return ()=>ac.abort()
    }
    const handleChange=(e)=>{
        setSelectedTable(e.target.value)
    }
    return (
        <div className="d-flex flex-column col-12 justify-content-center flex-wrap">
            <select name="table_id" className="mx-auto" onChange={handleChange}>
                {tableList.map(table=>(<option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>))}
            </select>
            <button type="submit" onClick={submitHandler}>Submit</button>
            <button onClick={()=>history.goBack()} className="col-6 mx-auto btn btn-danger">Cancel</button>
        </div>
    )
}