import { useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";



function Home() {

  const user = useSelector(state => state.auth.user); 
  const navigate = useNavigate();
 
  useEffect(() => {
    // Check if user is populated
    if (user) {
      // Redirect to the new ticket page
      navigate("/new-ticket");
    }
  }, [user, navigate]);

  const { t, i18n } = useTranslation();

  return (
    <>
    
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
  <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
{/*
    <div class="flex justify-center">
      <a class="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-200" href="#">
        PRO release - Join to waitlist
        <span class="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-gray-200 font-semibold text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </span>
      </a>
    </div>
 
*/}
 
    <div class="max-w-2xl text-center mx-auto">
      <h1 class="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
      {t("WelcometoDryicesupportcenter")}
        <span class="bg-clip-text bg-gradient-to-tl from-blue-700 to-blue-700 text-transparent">{t("p2")}</span>
      </h1>
    </div>
    

    <div class="mt-5 max-w-3xl text-center mx-auto">
      <p class="text-lg text-gray-700 dark:text-gray-500"> {t("homep")}</p>
    </div>


    <div class="mt-8 gap-3 flex justify-center">

      <Link to="/new-ticket" type="button" class="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-blue-600 hover:from-blue-600hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4 dark:focus:ring-offset-gray-800">
      {t("CreateTicket")}
        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </Link>
    </div>
  


  </div>
  <div className="bg-white p-8 mt-4 sm:flex justify-between gap-4 rounded-lg border">
          <div className="text-left">
            <h6 className="text-base font-semibold">{t("Unmatched Reliability")}</h6>
            <p className="mt-2">{t("Count on us for uninterrupted service.")}</p>
          </div>
          <div className="text-left">
            <h6 className="text-base font-semibold">
             {t("Exceptional User Experience")}
            </h6>
            <p className="mt-2">
             {t("Easy-to-use interface for a seamless experience.")}
            </p>
          </div>
          <div className="text-left">
            <h6 className="text-base font-semibold">{t("24/7 Expert Support")}</h6>
            <p className="mt-2">{t("Round-the-clock assistance from our experts.")}</p>
          </div>
        </div>
</div>
<div class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>



{/*
      <div className="absolute inset-x-44 top-64 " id="home">
        <div className="flex flex-col items-center justify-center text-white">
          <h1 className="font-bold text-2xl mb-6">
          {t("WelcometoDryicesupportcenter")}{" "}
          </h1>
          <a
            href="/new-ticket"
            class="bg-blue-500 px-6 py-3 shadow-sm hover:bg-blue-700 rounded-full text-white text-base font-semibold w-64 text-center"
          >
            <span className="relative">{t("CreateTicket")}</span>
          </a>

           <p className="mt-8 text-gray-700 dark:text-gray-300">
            Welcome to our cutting-edge ticketing and support system. We are
            dedicated to providing you with top-tier customer service and
            assistance. Our innovative solutions and passionate team are here to
            make your experience as smooth as possible, so you can focus on what
            you do best.
          </p> 
        </div>
        <div className="bg-white p-8 mt-44 sm:flex justify-between gap-4 rounded-lg border">
          <div className="text-left">
            <h6 className="text-base font-semibold">{t("Unmatched Reliability")}</h6>
            <p className="mt-2">{t("Count on us for uninterrupted service.")}</p>
          </div>
          <div className="text-left">
            <h6 className="text-base font-semibold">
             {t("Exceptional User Experience")}
            </h6>
            <p className="mt-2">
             {t("Easy-to-use interface for a seamless experience.")}
            </p>
          </div>
          <div className="text-left">
            <h6 className="text-base font-semibold">{t("24/7 Expert Support")}</h6>
            <p className="mt-2">{t("Round-the-clock assistance from our experts.")}</p>
          </div>
        </div>
      </div>
      */}
    </>
  );
}
export default Home;
