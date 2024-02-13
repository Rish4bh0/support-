import * as React from "react";
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
  return (
    <ThemeProvider theme={theme}>
      <div className="mb-4 text-sm">
        <Breadcrumbs aria-label="breadcrumb" className="border-b-1 pb-3">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <div className="font-semibold">Dashboard</div>
        </Breadcrumbs>
      </div>
    </ThemeProvider>
  );
}

export default BreadcrumbsComponent;
