import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "./configurations/theme";
import Routes from "./configurations/Routes";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes></Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
