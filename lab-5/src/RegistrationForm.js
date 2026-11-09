import React, { useState } from "react";

export default function RegistrationForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const { name, email, password } = form;
    const errs = {};

    if (!name) errs.name = "Name is required";
    else if (name.length < 3) errs.name = "Name must be at least 3 letters";

    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email is invalid";

    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 letters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted!");
      setForm({ name: "", email: "", password: "" });
    }
  };

  return (
    <div>
      <h1>Registration form for USER Input:</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <div>{errors.name}</div>

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <div>{errors.email}</div>

        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <div>{errors.password}</div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}