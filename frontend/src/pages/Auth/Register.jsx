import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData; // destructuring

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [isError, isSuccess, user, navigate, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="absolute">
        <div className="bg-white rounded-lg w-96">
          <div className="text-center mb-4 p-6">
            <div className="font-bold text-lg mb-2">Register</div>
            <div>Welcome ! Please Register.</div>
          </div>
          <section className="form pb-6">
            <form onSubmit={onSubmit}>
              <div className="form-group mb-4">
                <label className="mb-1 block font-semibold text-sm">Name</label>
                <TextField
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your name"
                  className="text-sm w-full"
                  size="small"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="mb-1 block font-semibold text-sm">
                  Email
                </label>
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className="text-sm w-full"
                  size="small"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="mb-1 block font-semibold text-sm">
                  Password
                </label>
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="text-sm w-full"
                  size="small"
                  required
                />
              </div>
              <div className="form-group mb-7">
                <label className="mb-1 block font-semibold text-sm">
                  Confirm Password
                </label>
                <TextField
                  type="password"
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  placeholder="Confirm your password"
                  className="text-sm w-full"
                  size="small"
                  required
                />
              </div>
              <div className="form-group">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="w-full"
                >
                  Submit
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default Register;
