import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { useStore } from "context/Store";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContentGrid: {
      display: "grid",
      gridAutoFlow: "row",
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
    divider: { background: "white", width: "100%" },
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
  const [uniqueLegendGenSelection, setUniqueGenSelection] = useState<
    FilterLegendProps[]
  >([]);

  const resetGenFilter = useCallback(() => {
    setUniqueGenSelection(
      Array.from([...new Set(state.legendsData.map((l) => l.gen))])
        .sort()
        .map((c) => {
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
      uniqueLegendGenSelection.map((u, i) =>
        i === idx ? { ...u, selected: !u.selected } : u
      )
    );
  };

  // title filters
  const [uniqueLegendTitleSelection, setUniqueLegendTitleSelection] = useState<
    FilterLegendProps[]
  >([]);

  const resetTitleFilter = useCallback(() => {
    setUniqueLegendTitleSelection(
      Array.from([...new Set(state.legendsData.map((l) => l.title))])
        .sort()
        .map((c) => {
          const filter: FilterLegendProps = {
            filterName: c,
            selected: false,
          };
          return filter;
        })
    );
  }, [state.legendsData]);

  const handleClickTitleFilter = (idx: number) => {
    setUniqueLegendTitleSelection(
      uniqueLegendTitleSelection.map((u, i) =>
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
      Array.from([...new Set(state.legendsData.map((l) => l.class))])
        .sort()
        .map((c) => {
          const filter: FilterLegendProps = {
            filterName: c,
            selected: false,
          };
          return filter;
        })
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
    resetTitleFilter();
    resetClassFilter();
  }, [resetClassFilter, resetGenFilter, resetTitleFilter]);

  useEffect(() => {
    resetAllFilters();
  }, [resetAllFilters, resetClassFilter, resetGenFilter]);

  const onConfirm = () => {
    dispatch({
      type: "UPDATE_LEGENDS_FILTERS",
      payload: {
        uniqueLegendGenSelection: uniqueLegendGenSelection,
        uniqueLegendTitleSelection: uniqueLegendTitleSelection,
        uniqueLegendClassSelection: uniqueLegendClassSelection,
      },
    });
    onCloseFilterMenu();
  };

  return (
    <Dialog
      open={filterDialogOpen}
      onClose={onCloseFilterMenu}
      maxWidth="md"
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
              Gen
            </Typography>

            <Grid container spacing={1} justifyContent="flex-start">
              {uniqueLegendGenSelection.map((c, idx) => (
                <Grid item>
                  <Button
                    variant={c.selected ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleClickGenFilter(idx)}
                  >
                    {c.filterName}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </div>

          <div>
            <Typography
              variant="h6"
              className={classes.filterTitle}
              color="primary"
            >
              Title
            </Typography>

            <Grid container spacing={1} justifyContent="flex-start">
              {uniqueLegendTitleSelection.map((c, idx) => (
                <Grid item>
                  <Button
                    variant={c.selected ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleClickTitleFilter(idx)}
                  >
                    {c.filterName}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </div>

          <div>
            <Typography
              variant="h6"
              className={classes.filterTitle}
              color="primary"
            >
              Class
            </Typography>

            <Grid container spacing={1} justifyContent="flex-start">
              {uniqueLegendClassSelection.map((c, idx) => (
                <Grid item>
                  <Button
                    variant={c.selected ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleClickClassFilter(idx)}
                  >
                    {c.filterName}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </div>

          {/* <Typography
            variant="h6"
            className={classes.filterTitle}
            color="common.white"
          >
            More filters coming soon!
          </Typography> */}
        </DialogContentText>
      </DialogContent>

      <Divider className={classes.divider} />

      <DialogActions className={classes.dialogActions}>
        <Button onClick={resetAllFilters}>Clear All Filters</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
