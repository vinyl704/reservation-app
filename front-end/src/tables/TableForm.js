import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import Error from "../reservations/Error";




export default function TableForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: 0,
  });
  const [errors, setErrors] = useState({});
const errorMap = Object.keys(errors).map((error, index) => (
    <Error key={index} error={error} />
  ));
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    history.goBack();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const ac = new AbortController();
    const signal = ac.signal;
    try {
      createTable(
        { ...formData, capacity: parseInt(formData.capacity) },
        signal
      );
      history.push("/dashboard");
    } catch (error) {
      if (!errors[error.message]) {
        setErrors({ ...errors, [error.message]: 1 });
      }
    }
    return ()=> ac.abort()
  };

  return (
    <>
      <h1 className="text-center">Create New Table</h1>
      <div className="createErrors">{errorMap ? errorMap : null}</div>
      <form onSubmit={submitHandler}>
        <div className="d-flex flex-wrap align-items-center justify-content-center px-4 py-4">
          <div className="form-group mx-auto">
            <label
              htmlFor="table_name"
              className="col-form-label col-form-label-lg"
            >
              Table Name
            </label>
            <input
              type="text"
              minLength="2"
              name="table_name"
              id="table_name"
              onChange={handleChange}
              value={formData.name}
              className="form-control form-control-lg"
              required
            />
          </div>
          <div className="form-group mx-auto">
            <label
              htmlFor="capacity"
              className="col-form-label col-form-label-lg"
            >
              Capacity
            </label>
            <input
              type="number"
              min="1"
              name="capacity"
              onChange={handleChange}
              value={formData.capacity}
              className="form-control form-control-lg"
              required
            />
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center justify-content-center">
          <button className="btn btn-lg btn-primary mx-auto" type="submit">
            Submit
          </button>
          <button
            className="btn btn-lg btn-danger mx-auto"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
