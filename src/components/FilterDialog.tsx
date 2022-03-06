import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContentGrid: {
      display: "grid",
      gridAutoFlow: "row",
      gridGap: theme.spacing(2),
    },
    filterButtonGrid: {
      display: "grid",
      gridAutoFlow: "column",
      gridGap: theme.spacing(2),
    },
    filterTitle: {
      textAlign: "start",
      fontWeight: 600,
    },
  })
);

interface FilterDialogProps {
  filterDialogOpen: boolean;
  onCloseFilterMenu: () => void;
  legends: LegendData[];
  uniqueLegendClassSelection: FilterLegendClassSelection[];
  setUniqueLegendClassSelection: Dispatch<
    SetStateAction<FilterLegendClassSelection[]>
  >;
}
const FilterDialog = (props: FilterDialogProps) => {
  const {
    filterDialogOpen,
    onCloseFilterMenu,
    legends,
    uniqueLegendClassSelection,
    setUniqueLegendClassSelection,
  } = props;
  const theme = useTheme();
  const classes = useLocalStyles();

  useEffect(() => {
    setUniqueLegendClassSelection(
      Array.from([...new Set(legends.map((l) => l.class))]).map((c) => {
        const filter: FilterLegendClassSelection = {
          filterName: c,
          selected: false,
        };
        return filter;
      })
    );
  }, [legends, setUniqueLegendClassSelection]);

  const handleClickClassFilter = (idx: number) => {
    setUniqueLegendClassSelection(
      uniqueLegendClassSelection.map((u, i) =>
        i === idx ? { ...u, selected: !u.selected } : u
      )
    );
  };

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
      {/* <DialogTitle>Filters coming soon!</DialogTitle> */}

      <DialogContent>
        <DialogContentText className={classes.dialogContentGrid}>
          <div>
            <Typography
              variant="h6"
              className={classes.filterTitle}
              color="primary"
            >
              Class
            </Typography>

            <div className={classes.filterButtonGrid}>
              {uniqueLegendClassSelection.map((c, idx) => (
                <Button
                  variant={c.selected ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleClickClassFilter(idx)}
                >
                  {c.filterName}
                </Button>
              ))}
            </div>
          </div>

          <Typography
            variant="h6"
            className={classes.filterTitle}
            color="common.white"
          >
            More filters coming soon!
          </Typography>
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
