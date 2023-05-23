import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationErrors from "./ReservationErrors";
import ReservationForm from "./ReservationForm";
import { hasValidDateAndTime } from "./ReservationValidate";

export const ReservationCreate = () => {
  const initialReservationState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [reservation, setReservation] = useState({
    ...initialReservationState,
  });
  const [reservationErrors, setReservationErrors] = useState(null);
  const history = useHistory();

  const changeHandler = (event) => {
    if (event.target.name === "people") {
      setReservation({
        ...reservation,
        [event.target.name]: Number(event.target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setReservation({
      ...reservation,
      [event.target.name]: Number(numericValue)
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    const errors = hasValidDateAndTime(reservation);
    if (errors.length) {
      return setReservationErrors(errors);
    }

    try {
      await createReservation(reservation, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setReservationErrors([error]);
    }

    return () => abortController.abort();
  };

  return (
    <section>
      <h2>Create a Reservation:</h2>
      <ReservationErrors errors={reservationErrors} />
      <ReservationForm
        reservation={reservation}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        handleChange={handleChange}
      />
    </section>
  );
};

export default ReservationCreate;