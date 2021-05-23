import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "./configurations/theme";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>N/A</ThemeProvider>
    </Router>
  );
}

export default App;
