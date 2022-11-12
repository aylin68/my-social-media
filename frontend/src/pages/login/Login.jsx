import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { Button, TextField, FormControl } from "@mui/material";
import { loginCall } from "../../utils/apiCalls";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": `email is not valid`,
      "string.empty": "email can't be empty",
      "string.required": `email is a required`,
    }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.base": `Enter a combination of at least 6 number, letters and punctuation marks (like ! and &).`,
    "string.min": `password should have at least 8 characters`,
    "string.max": `password should have less than 20 characters`,
    "string.empty": "password can't be empty",
    "string.required": `password is a required`,
  }),
});

const Login = () => {
  const navigation = useNavigate();
  const { isFetching, dispatch } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema), mode: "onBlur" });

  const onSubmit = (data) => {
    loginCall(
      { email: data.email, password: data.password },
      dispatch,
      navigation
    );
  };

  const handleOpen = () => {
    navigation("/register");
  };

  return (
    <div className="loginContainer">
      <div className="containerLeft">
        <h1>Foodsocial</h1>
        <p>Connect with friends and share photo of dishes on Foodsocial</p>
      </div>
      <div className="containerRight">
        <form onSubmit={handleSubmit(onSubmit)} className="formLogin">
          <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              {...register("email", { required: true })}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              size="small"
            />
          </FormControl>
          {errors.email && (
            <p className="errorMessage">{errors.email.message}</p>
          )}
          <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              {...register("password", { required: true })}
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              size="small"
            />
          </FormControl>
          {errors.password && (
            <p className="errorMessage">{errors.password.message}</p>
          )}
          <Button
            className="loginButton"
            variant="contained"
            type="submit"
            disabled={isFetching}
          >
            {isFetching ? "Loading" : "LogIn"}
          </Button>
          <Link to="/" className="forgotPassword">
            Forgot Password
          </Link>
          <div className="createAccountBox">
            <Button
              style={{ width: "204px" }}
              color="success"
              variant="contained"
              onClick={handleOpen}
            >
              {isFetching ? "Loading" : "Create new account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
