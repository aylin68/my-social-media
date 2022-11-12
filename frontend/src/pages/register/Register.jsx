import React from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate, Link } from "react-router-dom";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { Button, TextField, FormControl, Box } from "@mui/material";
import "./register.css";
import axios from "axios";

//.regex('/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/')
///^\[A-z\][A-z0-9-_]{3,23}$/

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": `email is not valid`,
      "string.empty": "email can't be empty",
      "string.required": `email is a required`,
    }),
  username: Joi.string().min(3).max(20).required().messages({
    "string.base": `username is a required.`,
    "string.min": `username should have at least 3 characters`,
    "string.max": `username should have less than 20 characters`,
    "string.empty": "username can't be empty",
    "string.required": `username is a required`,
  }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.base": `Enter a combination of at least 6 number, letters and punctuation marks (like ! and &).`,
    "string.min": `password should have at least 6 characters`,
    "string.max": `password should have less than 20 characters`,
    "string.empty": "password can't be empty",
    "string.required": `password is a required`,
  }),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({
      "any.only": "{{#label}} does not match",
    }),
});

const Register = () => {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema), mode: "onBlur" });

  const onSubmit = async (data) => {
    const user = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    try {
      await axios.post("/auth/register", user);
      navigation("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box className="register-container">
      <h1>FoodSocial</h1>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create a new account</h2>
        <span className="signUpSpan">It's quick and easy.</span>
        <FormControl fullWidth sx={{ m: 1 }} style={{ marginLeft: "0px" }}>
          <TextField
            {...register("username", { required: true })}
            id="outlined-basic"
            label="username"
            variant="outlined"
            size="small"
            type="text"
          />
          {errors.username && (
            <p className="errorMessage">{errors.username.message}</p>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} style={{ marginLeft: "0px" }}>
          <TextField
            {...register("email", { required: true })}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            size="small"
            type="email"
          />
          {errors.email && (
            <p className="errorMessage">{errors.email.message}</p>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} style={{ marginLeft: "0px" }}>
          <TextField
            {...register("password", { required: true })}
            id="outlined-basic"
            label="password"
            variant="outlined"
            size="small"
            type="password"
          />
          {errors.password && (
            <p className="errorMessage">{errors.password.message}</p>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} style={{ marginLeft: "0px" }}>
          <TextField
            {...register("confirmPassword", { required: true })}
            id="outlined-basic"
            label="confirm password"
            variant="outlined"
            type="password"
            size="small"
          />
          {errors.confirmPassword && (
            <p className="errorMessage">{errors.confirmPassword.message}</p>
          )}
        </FormControl>
        <Button
          color="success"
          variant="contained"
          className="signUpButton"
          type="submit"
        >
          Sign Up
        </Button>
        <Link className="loginLink" to="/login">
          Already have an account?
        </Link>
      </form>
    </Box>
  );
};

export default Register;
