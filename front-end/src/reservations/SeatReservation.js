import { useEffect, useState } from "react"
import { useHistory,useParams } from "react-router"
import { getTables,seatReservation, setReservationStatus } from "../utils/api"
import Error from "./Error"
export default function SeatReservation(){
    
    const {reservation_id} = useParams()
    //console.log(reservation_id)
    const history = useHistory()
    const [tableList,setTableList] = useState([])
    useEffect(()=>{
        const ac = new AbortController()
        getTables(ac.signal).then(setTableList)
        return ()=>ac.abort()
    },[])
    //console.log(selectedTable)
    const [errors,setErrors] = useState({})
    const [selectedTable,setSelectedTable] = useState(1)
    const errorMap = Object.keys(errors).map((error, index) => (
        <Error key={index} error={error} />
        ));
        const submitHandler = async (e)=>{
            e.preventDefault();
            
        //console.log("selectedTable: ",selectedTable)
        try {
            await seatReservation(selectedTable,reservation_id)
            history.push("/dashboard")
        } catch (error) {
            if(!errors[error.message]){
                setErrors({ ...errors, [error.message] : 1})
              }
        }
        await setReservationStatus(reservation_id)
        
    }
    const handleChange=(e)=>{
        setSelectedTable(e.target.value)
    }
    //console.log(errors)
    //const errorElement = errors.map(err=><ErrorAlert error={err}/>)
    return (
        <div className="d-flex flex-column col-12 justify-content-center flex-wrap">
      <div className="createErrors">{errorMap ? errorMap : null}</div>
            <select name="table_id" className="mx-auto" onChange={handleChange}>
                {tableList.map(table=>(<option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>))}
            </select>
            <button type="submit" onClick={submitHandler}>Submit</button>
            <button onClick={()=>history.goBack()} className="col-6 mx-auto btn btn-danger">Cancel</button>
        </div>
    )
}