import React from "react";
import { Dialog, DialogTitle } from "@mui/material";

interface FilterDialogProps {
  filterDialogOpen: boolean;
  onCloseFilterMenu: () => void;
}
const FilterDialog = (props: FilterDialogProps) => {
  const { filterDialogOpen, onCloseFilterMenu } = props;

  return (
    <Dialog open={filterDialogOpen} onClose={onCloseFilterMenu}>
      <DialogTitle>Filters coming soon!</DialogTitle>
      {/* <DialogContent>
        <DialogContentText>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseFilterMenu}>Disagree</Button>
        <Button onClick={onCloseFilterMenu} autoFocus>
          Agree
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default FilterDialog;
