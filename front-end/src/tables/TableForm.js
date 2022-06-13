import { useState } from "react"
import { useHistory } from "react-router"
import { createTable } from "../utils/api"

export default function TableForm(){
    const history = useHistory()
    const [formData,setFormData] = useState({
        table_name:'',
        capacity:0
    })
    const handleChange = ({target})=>{
        setFormData({...formData,[target.name]:target.value})
    }

    const cancelHandler = (e) =>{
        e.preventDefault();
        history.goBack();
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        const ac = new AbortController();
        const signal = ac.signal
        try {
            createTable({...formData,capacity:parseInt(formData.capacity)},signal)
            history.push('/dashboard')
        } catch (error) {
            throw error
        }
        
    }

    return (
    <form onSubmit={submitHandler}>  
        <label htmlFor="table_name">Table Name</label>
        <input type="text" minLength="2" name="table_name" id="table_name" onChange={handleChange} value={formData.name} required/>
        <label htmlFor="capacity">Capacity</label>
        <input type="number" min="1" name="capacity" onChange={handleChange} value={formData.capacity}/>
        <button className="btn btn-primary" type="submit">Submit</button>
        <button className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
    </form>
    )
}