import { useState } from "react"
import { useHistory } from "react-router"
import { formSubmit } from "../utils/api"

export default function TableForm(){
    const history = useHistory()
    const [formData,setFormData] = useState({
        table_name:'',
        capacity:0
    })
    console.log(formData)
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
        formSubmit({...formData,capacity:Number(formData.capcity)},signal)
        .then(history.push('/dashboard'))
    }

    return (
    <form onSubmit={submitHandler}>  
        <label htmlFor="table_name">Table Name</label>
        <input type="text" name="table_name" id="table_name" onChange={handleChange} value={formData.name}/>
        <label htmlFor="capacity">Capacity</label>
        <input type="number" min={1} name="capacity" onChange={handleChange} value={formData.capacity}/>
        <button className="btn btn-primary" type="submit">Submit</button>
        <button className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
    </form>
    )
}