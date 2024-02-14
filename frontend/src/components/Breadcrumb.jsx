import React from "react";
import { useLocation } from "react-router-dom"; // Assuming you're using React Router
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
  },
});

function BreadcrumbsComponent() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <ThemeProvider theme={theme}>
      <div className="mb-4 text-sm">
        <Breadcrumbs aria-label="breadcrumb" className="border-b-1 pb-3">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            return (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={routeTo}
              >
                {pathname.replace(/^\w/, (c) => c.toUpperCase())}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>
    </ThemeProvider>
  );
}

export default BreadcrumbsComponent;
