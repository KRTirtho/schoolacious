import React from "react";
import { useState } from "react";
import {
  ThemeProvider,
  createMuiTheme,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider
        theme={createMuiTheme({
          props: { MuiButtonBase: { disableRipple: true } },
        })}
      >
        <Grid container alignItems="center" direction="column" justify="center">
          {/* header of the counter */}
          <Typography variant="h1">Counter React</Typography>
          <Typography variant="h3">The count is {count}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount(count + 1)}
          >
            Click
          </Button>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default App;
