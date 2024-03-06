import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ to, icon, onClick, color, fontSize }) => {
  return (
    <Button
      component={to ? "a" : "button"}
      href={to}
      variant="contained"
      color={color || "primary"}
      style={{ minWidth: "35px", padding: "6px 9px", marginRight: "5px" }}
      onClick={onClick}
    >
      {React.cloneElement(icon, { style: { fontSize: "13px" } })}
    </Button>
  );
};

export default CustomButton;
