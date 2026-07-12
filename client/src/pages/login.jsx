import { useState } from "react";
import AppForm from "../components/app-form";
import Button from "react-bootstrap/Button";
import useLogin from "../hooks/use-login";
import { Error } from "../components/error";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <>
    <img
              alt=""
              src={`${process.env.PUBLIC_URL}/favicon.ico`}
              width="64"
              height="64"
              className="d-inline-block align-top rounded-circle mx-auto d-block my-4"
            />
            <hr className="my-4" />
    <AppForm.Form onSubmit={handleSubmit}>
      <AppForm.Header> Login to CareerConnect </AppForm.Header>
    
      <AppForm.Group>
        {/* <AppForm.Label>Email:</AppForm.Label> */}
        <AppForm.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </AppForm.Group>
      <AppForm.Group>
        {/* <AppForm.Label>Password:</AppForm.Label> */}
        <AppForm.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </AppForm.Group>
      <Button type="submit" variant="primary" disabled={isLoading} className="w-100">
        Login
      </Button>
      <Error className="mt-3" message={error} />
    </AppForm.Form>
    <p className="text-center mt-3">
      Don't have an account? <Link to="/register">Register here</Link>
    </p>
    </>
  );
};



export default Login;