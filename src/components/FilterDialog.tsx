import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { useStore } from "context/Store";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    borderBottom: { borderBottom: "1px solid" },
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
    dialogActions: {
      alignSelf: "end",
      display: "grid",
      gridGap: theme.spacing(1),
    },
  })
);

interface FilterDialogProps {
  filterDialogOpen: boolean;
  onCloseFilterMenu: () => void;
}
const FilterDialog = (props: FilterDialogProps) => {
  const { filterDialogOpen, onCloseFilterMenu } = props;
  const theme = useTheme();
  const classes = useLocalStyles();
  const { state, dispatch } = useStore();

  // class filters
  const [uniqueLegendClassSelection, setUniqueLegendClassSelection] = useState<
    FilterLegendClassSelection[]
  >([]);

  const resetClassFilter = useCallback(() => {
    setUniqueLegendClassSelection(
      Array.from([...new Set(state.legendsData.map((l) => l.class))]).map(
        (c) => {
          const filter: FilterLegendClassSelection = {
            filterName: c,
            selected: false,
          };
          return filter;
        }
      )
    );
  }, [state.legendsData]);

  useEffect(() => {
    resetClassFilter();
  }, [resetClassFilter, setUniqueLegendClassSelection, state.legendsData]);

  const handleClickClassFilter = (idx: number) => {
    setUniqueLegendClassSelection(
      uniqueLegendClassSelection.map((u, i) =>
        i === idx ? { ...u, selected: !u.selected } : u
      )
    );
  };

  const onClearAllFilters = () => {
    resetClassFilter();
  };

  const onConfirm = () => {
    dispatch({
      type: "UPDATE_CLASS_FILTERS",
      payload: {
        uniqueLegendClassSelection: uniqueLegendClassSelection,
      },
    });
    onCloseFilterMenu();
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

      <DialogContent className={classes.borderBottom}>
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

      <Divider />

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClearAllFilters}>Clear All Filters</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
