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
      width: "fit-content",
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

  // gen filters
  const [uniqueGenSelection, setUniqueGenSelection] = useState<
    FilterLegendProps[]
  >([]);

  const resetGenFilter = useCallback(() => {
    setUniqueGenSelection(
      Array.from([...new Set(state.legendsData.map((l) => l.gen))]).map((c) => {
        const filter: FilterLegendProps = {
          filterName: c,
          selected: false,
        };
        return filter;
      })
    );
  }, [state.legendsData]);

  const handleClickGenFilter = (idx: number) => {
    setUniqueGenSelection(
      uniqueGenSelection.map((u, i) =>
        i === idx ? { ...u, selected: !u.selected } : u
      )
    );
  };

  // class filters
  const [uniqueLegendClassSelection, setUniqueLegendClassSelection] = useState<
    FilterLegendProps[]
  >([]);

  const resetClassFilter = useCallback(() => {
    setUniqueLegendClassSelection(
      Array.from([...new Set(state.legendsData.map((l) => l.class))]).map(
        (c) => {
          const filter: FilterLegendProps = {
            filterName: c,
            selected: false,
          };
          return filter;
        }
      )
    );
  }, [state.legendsData]);

  const handleClickClassFilter = (idx: number) => {
    setUniqueLegendClassSelection(
      uniqueLegendClassSelection.map((u, i) =>
        i === idx ? { ...u, selected: !u.selected } : u
      )
    );
  };

  // handle all filters
  // set all filters on load
  const resetAllFilters = useCallback(() => {
    resetGenFilter();
    resetClassFilter();
  }, [resetClassFilter, resetGenFilter]);

  useEffect(() => {
    resetAllFilters();
  }, [resetAllFilters, resetClassFilter, resetGenFilter]);

  const onConfirm = () => {
    dispatch({
      type: "UPDATE_LEGENDS_FILTERS",
      payload: {
        uniqueGenSelection: uniqueGenSelection,
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
              Gen
            </Typography>

            <div className={classes.filterButtonGrid}>
              {uniqueGenSelection.map((c, idx) => (
                <Button
                  variant={c.selected ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleClickGenFilter(idx)}
                >
                  {c.filterName}
                </Button>
              ))}
            </div>
          </div>

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
        <Button onClick={resetAllFilters}>Clear All Filters</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
