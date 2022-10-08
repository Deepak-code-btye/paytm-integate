import React, { useState } from "react";
import "./App.css";
import { useForm } from "react-hook-form";
const App = () => {
  const {
    register,
    handleSubmit,
    // watch,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm();
  function isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === "[object Date]";
  }

  function isObj(val) {
    return typeof val === "object";
  }

  function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  }

  function buildForm({ action, params }) {
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", action);

    Object.keys(params).forEach((key) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", key);
      input.setAttribute("value", stringifyValue(params[key]));
      form.appendChild(input);
    });

    return form;
  }

  function post(details) {
    const form = buildForm(details);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  const getData = (data) => {
    return fetch(`http://localhost:5000/api/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  const onSubmit = (data) => {
    // console.log(data);
    getData(data).then((response) => {
      console.log(response);
      var information = {
        action: "https://securegw-stage.paytm.in/order/process",
        params: response,
      };
      post(information);
    });
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className="max-w-[356px] flex flex-col"
      >
        <label
          htmlFor=""
          className="text-sm text-black font-Raleway flex flex-col gap-y-2 mt-3"
        >
          <span className="font-Raleway pl-2">Email</span>
          <input
            type="text"
            required
            className="rounded-3xl drop-shadow-3xl bg-opacity-25 pl-4 py-2 font-Raleway outline-none text-black"
            name="amount"
            placeholder="Enter the amount"
            {...register("amount", { required: true })}
          />
        </label>

        <label
          htmlFor=""
          className="flex flex-col gap-y-2 mt-3 text-black text-sm font-Raleway"
        >
          <span className="font-Raleway pl-2">Phone Number</span>
          <input
            type="number"
            onInput={(e) => (e.target.value = e.target.value.slice(0, 10))}
            className="rounded-3xl drop-shadow-3xl bg-opacity-25 pl-4 py-2 font-Raleway outline-none text-black"
            name="mobile_no"
            placeholder="Enter the Phone"
            {...register("mobile_no")}
          />
        </label>

        <button
          type="Submit"
          className="whitespace-nowrap bg-opacity-25 shadow-md border-opacity-50 rounded-lg m-auto w-32 text-center py-2 mt-5 hover:bg-[#ffff0033] cursor-pointer"
        >
          Submit
        </button>
      </form>
      {/* <button onClick={makePayment}>PAY USING PAYTM</button> */}
    </div>
  );
};

export default App;
