import { createMuiTheme } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

export default createMuiTheme({
  props: {
    MuiButtonBase: { disableRipple: true },
    MuiButton: {
      disableElevation: true,
      variant: "contained",
      color: "primary",
    },
    MuiButtonGroup: {
      disableElevation: true,
      disableRipple: true,
      disableFocusRipple: true,
    },
    MuiIconButton: {
      disableRipple: true,
      disableFocusRipple: true,
      disableTouchRipple: true,
    },
    MuiStepButton: {
      disableRipple: true,
      disableTouchRipple: true,
    },
    MuiTextField: {
      variant: "outlined",
      size: "small"
    }
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
        transition: "all 250ms ease",
        "&:hover": {
          filter: "brightness(0.95)",
        },
        "&:active": {
          filter: "brightness(1.12)",
          transform: "scale(0.92)",
        },
      },
    },
  },
});
