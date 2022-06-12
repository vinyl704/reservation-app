import React, { useState } from "react";
import { finishReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
export default function Table({ table }) {
  const history = useHistory();
  
  const finishHandler = async (e) => {
    e.preventDefault();
    const conf = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (conf) {
      await finishReservation(table.table_id);
      history.push("/");
    }
  };

  return (
    <tr key={table.table_id}>
      <td>{table.table_id}</td>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={`${table.table_id}`}>
        {table.reservation_id ? "Occupied" : "Free"}
      </td>
      <td>
        {table.reservation_id && (
          <button data-table-id-finish={table.table_id} onClick={finishHandler}>
            Finish
          </button>
        )}
      </td>
    </tr>
  );
}
