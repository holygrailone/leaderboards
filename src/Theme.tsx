import { createTheme } from "@mui/material/styles";

const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#f59e1d",
    },
    background: {
      default: "#3d3830",
    },
    tonalOffset: 0.5,
  },
  spacing: 8,
});

export default AppTheme;
