import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { useStore } from "store/Store";

interface FilterDialogProps {
  filterDialogOpen: boolean;
  onCloseFilterMenu: () => void;
}
const FilterDialog = (props: FilterDialogProps) => {
  const { filterDialogOpen, onCloseFilterMenu } = props;
  const { state } = useStore();
  const theme = useTheme();

  const uniqueLegendClasses = Array.from([
    ...new Set(state.legendsData.map((l) => l.class)),
  ]);

  return (
    <Dialog
      open={filterDialogOpen}
      onClose={onCloseFilterMenu}
      PaperProps={{
        style: {
          textAlign: "center",
          color: "white",
          backgroundColor: theme.palette.background.default,
          alignItems: "start",
        },
      }}
      scroll="paper" // content of the dialog scrolls within paper element
    >
      <DialogTitle>Filters coming soon!</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Typography variant="h6">Class</Typography>

          {uniqueLegendClasses.map((c) => (
            <Button variant="outlined">{c}</Button>
          ))}
        </DialogContentText>
      </DialogContent>

      {/* <DialogActions>
        <Button onClick={onCloseFilterMenu}>Disagree</Button>
        <Button onClick={onCloseFilterMenu} autoFocus>
          Agree
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default FilterDialog;
