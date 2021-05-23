import { createMuiTheme } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

export default createMuiTheme({
  props: {
    MuiButtonBase: { disableRipple: true },
    MuiButton: { disableElevation: true },
  },
  palette: {
    primary: {
      main: blue[500],
      dark: blue[500],
      light: blue[500],
    },
  },
  overrides: {
    MuiButtonBase: {
      root: {
        "&:active": {
          transition: "all 250ms ease",
          filter: "brightness(1.12)",
          transform: "scale(0.92)",
        },
      },
    },
  },
});
