import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { t } = useTranslation();
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
      <div className="absolute z-10">
        <div className="bg-white rounded-lg w-96">
        <div className="text-center p-6">
          <h1 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">{t("Regi")}<mark class="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">{t("ster")}</mark> </h1>
<p class="text-lg font-normal text-gray-500 lg:text-md dark:text-gray-400">{t("Welcome! please register")}</p>
          </div>
          <section className="form pb-6">
            <form onSubmit={onSubmit}>
              <div className="form-group mb-4">
                <label className="mb-1 block font-semibold text-sm">{t("Name")}</label>
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
                  {t("Email")}
                </label>
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="example@gmail.com"
                  className="text-sm w-full"
                  size="small"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="mb-1 block font-semibold text-sm">
                  {t("Password")}
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
                  {t("Confirm Password")}
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
              <button  type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{t("Submit")}</button>
              </div>
            </form>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
                       {t("Account already created?")} <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-500">{t("Login")}</Link>
                    </div>
          </section>
        </div>
      </div>
      <div class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
    </>
  );
}

export default Register;
