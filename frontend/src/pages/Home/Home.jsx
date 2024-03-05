import { useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Padding } from "@mui/icons-material";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is populated
    if (user) {
      // Redirect to the new ticket page
      navigate("/new-ticket");
    }
  }, [user, navigate]);

  return (
    <>
      <div
        className="banner-image after:bg-black after:absolute after:inset-0 after:opacity-50"
        style={{ height: "60vh" }}
      >
        <div className="absolute inset-x-44 top-52 z-50 " id="home">
          <div className="flex flex-col items-center justify-center text-white">
            <h1 className="font-bold text-2xl mb-6">
              Empowering Excellence, Uninterrupted Support.
            </h1>

            <div className="w-400">
              <TextField
                variant="outlined"
                fullWidth
                className="rounded-xl"
                placeholder="Search now ..."
                style={{ backgroundColor: "#fff" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" style={{ background: "blue" }}>
                        <SearchIcon style={{ color: "white" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* <p className="mt-8 text-gray-700 dark:text-gray-300">
            Welcome to our cutting-edge ticketing and support system. We are
            dedicated to providing you with top-tier customer service and
            assistance. Our innovative solutions and passionate team are here to
            make your experience as smooth as possible, so you can focus on what
            you do best.
          </p> */}
          </div>
          <div className="bg-white p-8 mt-44 sm:flex justify-between gap-4 rounded-lg border">
            <div className="text-left">
              <h6 className="text-base font-semibold">Unmatched Reliability</h6>
              <p className="mt-2">Count on us for uninterrupted service.</p>
            </div>
            <div className="text-left">
              <h6 className="text-base font-semibold">
                Exceptional User Experience
              </h6>
              <p className="mt-2">
                Easy-to-use interface for a seamless experience.
              </p>
            </div>
            <div className="text-left">
              <h6 className="text-base font-semibold">24/7 Expert Support</h6>
              <p className="mt-2">
                Round-the-clock assistance from our experts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
