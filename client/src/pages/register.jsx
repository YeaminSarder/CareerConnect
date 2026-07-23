import { useState } from "react";
import AppForm from "../components/app-form";
import Button from "react-bootstrap/Button";
import useRegister from "../hooks/use-register";
import { Error } from "../components/error";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { register, isLoading, error } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password, name);
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
      <AppForm.Header> Register to CareerConnect </AppForm.Header>
      <AppForm.Group>
        {/* <AppForm.Label>Name:</AppForm.Label> */}
        <AppForm.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      </AppForm.Group>
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
        Register
      </Button>
      <Error className="mt-3" message={error} />
    </AppForm.Form>
    <p className="text-center mt-3">
      Already have an account? <Link to="/login">Login here</Link>
    </p>
    </>
  );
};



export default Register;