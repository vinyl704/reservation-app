import React, {useEffect, useState} from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import Error from "./Error";


//const url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
export default function ReservationForm() {
    const initForm = {
        first_name: '',
        last_name: '',
        mobile_number:'',
        reservation_date:'',
        reservation_time: '',
        people: 1

    }
    
    const [formData,setFormData] = useState(initForm)
    const [errors,setErrors] = useState({})
    const history = useHistory()
    
   
    const errorMap = Object.keys(errors).map((error, index) => (
      <Error key={index} error={error} />
    ));

    const cancelHandler = (e) => {
        e.preventDefault()
        history.go(-1)
    }
    const changeHandler = (e) =>{
        e.preventDefault()
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const submitHandler = async (e) =>{
      e.preventDefault();
      const ac = new AbortController();
      formData.people = parseInt(formData.people);
      try {
        await createReservation(formData, ac.signal);
        setErrors({});
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        if(!errors[error.message]){
          setErrors({ ...errors, [error.message] : 1})
        }
      }
      return () => ac.abort();
    }
  return (<>
      <div className="createErrors">{errorMap ? errorMap : null}</div>
    <form onSubmit={submitHandler}>
      <label htmlFor="firstName">First Name</label>
      <input type="text" name="first_name" id="firstName" placeholder="First Name" value={formData.first_name} onChange={changeHandler}/>
      <label htmlFor="last_name">Last Name</label>
      <input type="text" name="last_name" id="lastName" placeholder="Last Name" value={formData.last_name} onChange={changeHandler}/>
      <label htmlFor="mobile_number">Mobile Number</label>
      <input type="phone" name="mobile_number" id="mobileNumber" placeholder="XXX-XXX-XXXX" value={formData.mobile_number} onChange={changeHandler}/>
      <label htmlFor="reservation_date">Reservation Date</label>
      <input type="date" name="reservation_date" id="reservationDate" value={formData.reservation_date} onChange={changeHandler}/>
      <label htmlFor="reservation_time">Reservation Time</label>
      <input type="time" name="reservation_time" id="reservationTime" onChange={changeHandler} value={formData.reservation_time}/>
      <label htmlFor="people">Party Size</label>
      <input type="number" name="people" id="people" value={formData.people} onChange={changeHandler} min={1} />

      <button type="submit">Submit</button>
      <button onClick={cancelHandler}>Cancel</button>
    </form>
  </>
  );
}
