import React, { useState } from "react";
import Reservations from "./Reservations";
import { listReservations } from "../utils/api";
export default function Search() {
  const [number, setNumber] = useState([]);
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleClick = (e) => {
    const ac = new AbortController();
    e.preventDefault();
    listReservations({ mobile_number: number }, ac.signal).then(setResults);
    return () => ac.abort();
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-4">
      <h1 className="text-center mb-3">Search for reservation</h1>
      <form>
      <div className="form-group">
        <input
          className="form-control form-control-lg col-12"
          type="search"
          pattern="/\W/"
          name="mobile_number"
          value={number}
          onChange={handleChange}
          placeholder="Enter a customer's phone number"
        />
        <button className="btn btn-lg btn-secondary col-12" type="submit" onClick={handleClick}>
          Find
        </button>
      </div>
      </form>
      {results.length ? (
        <Reservations reservations={results} />
      ) : (
        <h3>No reservations found</h3>
      )}
    </div>
  );
}
