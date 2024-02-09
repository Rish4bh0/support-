import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import { useStateContext } from "../contexts/ContextProvider";

function Login() {
  const { activeMenu, setactiveMenu } = useStateContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData; // destructuring

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
      setactiveMenu(true);
      if (user) {
        if (["ADMIN", "EMPLOYEE", "SUPERVISOR"].includes(user.role)) {
          navigate("/admindash"); // Redirect to the dashboard route for ADMIN, SUPERVISOR, EMPLOYEE
        } else if (user.role === "ORGAGENT") {
          navigate("/dash"); // Redirect to the organization route for ORGAGENT
        } else if (user.role === "SUPERVISOR") {
          navigate("/dash"); // Redirect to the organization route for ORGAGENT
        } else {
          navigate("/new-ticket"); // Redirect to the home route for other roles
        }
      }
      dispatch(reset());
    }
  }, [isError, isSuccess, user, navigate, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="absolute">
        <div className="bg-white rounded-lg w-96">
          <div className="text-center mb-4 p-6">
            <div className="font-bold text-lg mb-2">Log In</div>
            <div>Welcome ! Please log in.</div>
          </div>
          <section className="form pb-6">
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="font-bold text-sm">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="font-bold text-sm">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="form-control"
                  required
                />
                <div className="text-sm">
                  <Link to="/forget">Forgot Password?</Link>
                </div>
              </div>

              <div className="form-group mt-8">
                <button className="btn btn-block">Submit</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default Login;
