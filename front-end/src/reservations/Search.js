import React,{ useState } from 'react'
import Reservations from './Reservations'
import { listReservations } from "../utils/api"
export default function Search(){
    
    const [number,setNumber] = useState([])
    const [results,setResults] = useState([])

    const handleChange = (e)=>{
        setNumber(e.target.value)
        console.log(number)
    }

    const handleClick = (e)=>{
        const ac = new AbortController()
        e.preventDefault()
        listReservations({mobile_number:number},ac.signal)
        .then(setResults)
        return ()=>ac.abort()
    }
    console.log(results)
    return(
        <div>

        <form>
            <input type="search" pattern='/\W/' name="mobile_number" value={number} onChange={handleChange}/>
            <button type="submit" onClick={handleClick}>Find</button>
        </form>
        {results.length ? <Reservations reservations={results}/> : <h3>No reservations found</h3>}
        </div>
    )
}