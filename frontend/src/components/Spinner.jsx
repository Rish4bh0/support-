import React from "react";
import "./Spinner.css"; // Import the CSS file

function Spinner({ uploadProgress }) {
  return (

    <div className="fullPageContainer ">
      <div className="loadingSpinnerContainer">
      <div className="Parent  items-center justify-center ">
  <div className="loadingSpinner">
    {/* Your loading spinner content */}
  </div>
  <div className="justify-center">
    {uploadProgress !== undefined && (
      <span className="uploadProgressText font-bold">{uploadProgress}% Uploading Media</span>
    )}
  </div>
</div>

      </div>
      </div>
  );
}


export default Spinner;
