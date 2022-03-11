import React, {
  useState,
  useEffect,
  ChangeEventHandler,
  MouseEvent,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  ReactNode,
} from "react";
import axios from "axios";
import {
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Tooltip,
  TableSortLabel,
  Pagination,
  Paper,
  Toolbar,
  IconButton,
  InputAdornment,
  TextField,
  Theme,
  useTheme,
  Badge,
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import goldMedal from "../assets/goldmedal.png";
import SearchIcon from "@mui/icons-material/Search";
import FilterDialog from "./FilterDialog";
import { useStore } from "context/Store";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

type OrderType = "asc" | "desc";

const tableHeaders: LegendLabelData[] = [
  { label: "Rank", id: "rank", numeric: true },
  { label: "Legend #", id: "legendid", numeric: true },
  { label: "Generation", id: "gen", numeric: true },
  { label: "Level", id: "level", numeric: true },
  { label: "XP", id: "xp", numeric: true },
  { label: "Name", id: "name", numeric: false },
  { label: "Title", id: "title", numeric: false },
  { label: "Class", id: "class", numeric: false },
  { label: "Gold", id: "gold", numeric: true },
  { label: "Knowledge", id: "knowledge", numeric: true },
  { label: "Minted", id: "minted", numeric: true },
  { label: "Banned", id: "banned", numeric: false },
  { label: "Owner", id: "address", numeric: false },
];

const iconSize = 30;
const tableCellPadding = 12;

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "90vw",
      margin: "auto",
      textAlign: "center",
      color: "white",
      backgroundColor: theme.palette.background.default,
      marginTop: 0,
      marginBottom: 0,
      display: "grid",
      gridTemplateRows: "max-content 1fr max-content",
      alignItems: "start",
    },
    tableContainerPaper: {
      "&.MuiPaper-root": {
        backgroundColor: theme.palette.background.default,
        borderRadius: 0,
      },
    },
    goldStarIcon: {
      width: iconSize,
      height: iconSize,
      verticalAlign: "middle",
    },
    tableHeader: {
      padding: theme.spacing(4),
      cursor: "pointer",
    },
    tableRow: {
      padding: 10,
    },
    footer: {
      border: "none",
      padding: 12,
      // transform: "translateY(-75%)",
    },
    paginationStyle: {
      "& .MuiPaginationItem-root.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .MuiPaginationItem-root": {
        color: "white",
      },
      justifyContent: "center",
    },
    toolbar: {
      borderBottom: "1px solid white",
      justifyContent: "space-between",
    },
    textfieldPrimaryColor: {
      borderWidth: 1,
      borderColor: theme.palette.primary.main,
    },
    baseCellStyle: {
      whiteSpace: "nowrap",
      padding: tableCellPadding,
    },
    horizontalGrid: {
      display: "grid",
      gridAutoFlow: "column",
      gridGap: theme.spacing(2),
      alignItems: "center",
    },
  })
);

interface StyledTableCellProps {
  rank?: boolean;
  numeric?: boolean;
  children: ReactNode;
}
const StyledTableCell = (props: StyledTableCellProps) => {
  const { rank, numeric } = props;
  const classes = useLocalStyles();

  if (rank) {
    return (
      <TableCell
        className={classes.baseCellStyle}
        style={{ textAlign: "center" }}
        sx={{ color: "white" }}
      >
        {props.children}
      </TableCell>
    );
  }
  if (numeric) {
    return (
      <TableCell
        className={classes.baseCellStyle}
        style={{ textAlign: "end" }}
        sx={{ color: "white" }}
      >
        {props.children}
      </TableCell>
    );
  }
  return (
    <TableCell className={classes.baseCellStyle} sx={{ color: "white" }}>
      {props.children}
    </TableCell>
  );
};

interface SortableTableHeadProps {
  onRequestSort: (event: MouseEvent, property: keyof LegendData) => void;
  order: OrderType;
  orderBy: string;
}
const SortableTableHead = (props: SortableTableHeadProps) => {
  const classes = useLocalStyles();
  const theme = useTheme();
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler =
    (property: keyof LegendData) => (event: MouseEvent) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead className={classes.tableHeader}>
      <TableRow hover className={classes.tableRow}>
        {tableHeaders.map((th) => {
          const orderByHeader = orderBy === th.id;
          const textAlignment =
            th.id === "rank" ? "center" : th.numeric ? "right" : "left";

          return (
            <TableCell
              key={th.id}
              sortDirection={orderByHeader ? order : false}
              align={textAlignment}
              className={classes.baseCellStyle}
              style={{
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "white",
              }}
              onClick={createSortHandler(th.id)}
            >
              <TableSortLabel
                active={orderByHeader}
                direction={orderByHeader ? order : "asc"}
                onClick={createSortHandler(th.id)}
                // colouring from https://stackoverflow.com/a/70180424
                sx={{
                  "&.MuiTableSortLabel-root:hover": {
                    color: theme.palette.primary.main,
                  },
                  "&.Mui-active": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiTableSortLabel-icon": {
                    color: `${theme.palette.primary.main} !important`,
                  },
                }}
              >
                {th.label}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

interface EnhancedTableToolbarProps {
  filterText: string;
  handleFilterTextChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleOpenFilterMenu: () => void;
  numRows: number;
  numFiltersActive: number;
}
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const {
    filterText,
    handleFilterTextChange,
    handleOpenFilterMenu,
    numRows,
    numFiltersActive,
  } = props;
  const theme = useTheme();
  const classes = useLocalStyles();

  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.horizontalGrid}>
        <Tooltip title="Search Name or Owner Address">
          <TextField
            variant="outlined"
            size="small"
            value={filterText}
            onChange={handleFilterTextChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: theme.palette.primary.main,
                "& fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Tooltip>

        <Typography variant="h6" color="primary">
          {numRows} legends shown
        </Typography>
      </div>

      <Tooltip title="Filter">
        <IconButton onClick={handleOpenFilterMenu}>
          <Badge badgeContent={numFiltersActive} color="primary">
            <FilterAltOutlinedIcon color="primary" fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

interface LeaderboardTableProps {
  setNumLegends: Dispatch<SetStateAction<number>>;
}
const LeaderboardTable = (props: LeaderboardTableProps) => {
  const { setNumLegends } = props;
  const classes = useLocalStyles();
  const { state, dispatch } = useStore();

  // pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const handleChangePage = (_e: unknown, newPage: number) => {
    setPage(newPage);
  };

  // text filter
  const [filterText, setFilterText] = useState("");
  const handleFilterTextChange = (e: ChangeEvent<{ value: unknown }>) => {
    setFilterText(e.target.value as string);
  };

  // filter dialog menu
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const handleOpenFilterMenu = () => {
    setFilterDialogOpen(true);
  };
  const handleCloseFilterMenu = () => {
    setFilterDialogOpen(false);
  };

  // fetch legends data
  const [legends, setLegends] = useState<LegendData[]>([]);
  useEffect(() => {
    axios
      .get("https://api.holygrail.one/legends.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        var newLegends = (res.data as LegendData[])
          .sort((a, b) => {
            // sort order: level / xp / mint number (legendid a.k.a time minted: earlier first)
            if (a.level === b.level) {
              if (a.xp === b.xp) {
                return a.legendid - b.legendid;
              }
              return b.xp - a.xp;
            }
            return b.level - a.level;
          })
          .map((l, idx) => {
            return { ...l, rank: idx + 1 };
          });
        setLegends(newLegends);
        setNumLegends(newLegends.length);
        dispatch({
          type: "UPDATE_LEGENDS_DATA",
          payload: {
            legendsData: newLegends,
          },
        });
      });
  }, [dispatch, setNumLegends]);

  const filteredLegends = legends
    .filter(
      (l) =>
        l.name.toLowerCase().includes(filterText.toLowerCase()) ||
        l.address.toLowerCase().includes(filterText.toLowerCase())
    )
    .filter(
      (l) =>
        (state.uniqueGenSelection.every((u) => !u.selected) ||
          state.uniqueGenSelection
            .filter((u) => u.selected)
            .some((u) => u.filterName === l.gen)) &&
        (state.uniqueLegendClassSelection.every((u) => !u.selected) ||
          state.uniqueLegendClassSelection
            .filter((u) => u.selected)
            .some((u) => u.filterName === l.class))
    );

  // sorting
  const [order, setOrder] = useState<OrderType>("asc");
  const [orderBy, setOrderBy] = useState<string>(tableHeaders[0].id);
  const handleRequestSort = (_e: MouseEvent, property: keyof LegendData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (
    a: LegendData,
    b: LegendData,
    orderBy: string
  ): number => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order: OrderType, orderBy: string) => {
    return order === "desc"
      ? (a: LegendData, b: LegendData) => descendingComparator(a, b, orderBy)
      : (a: LegendData, b: LegendData) => -descendingComparator(a, b, orderBy);
  };

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar
        filterText={filterText}
        handleFilterTextChange={handleFilterTextChange}
        handleOpenFilterMenu={handleOpenFilterMenu}
        numRows={filteredLegends.length}
        numFiltersActive={
          state.uniqueLegendClassSelection.some((u) => u.selected) ? 1 : 0
        }
      />

      <TableContainer component={Paper} className={classes.tableContainerPaper}>
        <Table>
          <SortableTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />

          <TableBody>
            {filteredLegends
              .sort(getComparator(order, orderBy))
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((legend, index) => (
                <TableRow key={index} className={classes.tableRow}>
                  <StyledTableCell rank>
                    {legend.rank === 1 ? (
                      <img
                        src={goldMedal}
                        className={classes.goldStarIcon}
                        alt="1"
                      />
                    ) : (
                      legend.rank
                    )}
                  </StyledTableCell>

                  <StyledTableCell numeric>{legend.legendid}</StyledTableCell>

                  <StyledTableCell numeric>{legend.gen}</StyledTableCell>

                  <StyledTableCell numeric>{legend.level}</StyledTableCell>

                  <StyledTableCell numeric>{legend.xp}</StyledTableCell>

                  <Tooltip title={legend.name} placement="right-start">
                    {/* not using StyledTableCell inside Tooltip bc of https://stackoverflow.com/questions/67627038/react-forward-ref-not-working-as-with-custom-compoent */}
                    <TableCell
                      className={classes.baseCellStyle}
                      sx={{
                        color: "white",
                      }}
                    >
                      {`${legend.name.substring(0, 20)}${
                        legend.name.length > 20 ? "..." : ""
                      }`}
                    </TableCell>
                  </Tooltip>

                  <StyledTableCell>{legend.title}</StyledTableCell>

                  <StyledTableCell>{legend.class}</StyledTableCell>

                  <StyledTableCell numeric>{legend.gold}</StyledTableCell>

                  <StyledTableCell numeric>{legend.knowledge}</StyledTableCell>

                  <StyledTableCell numeric>
                    {new Date(legend.minted * 1000)
                      .toLocaleDateString("en-US")
                      .toString()}
                  </StyledTableCell>

                  <StyledTableCell>{legend.banned.toString()}</StyledTableCell>

                  <Tooltip title={legend.address} placement="right-start">
                    {/* not using StyledTableCell inside Tooltip bc of https://stackoverflow.com/questions/67627038/react-forward-ref-not-working-as-with-custom-compoent */}
                    <TableCell>
                      <div
                        style={{
                          color: "white",
                          display: "inline-flex",
                          verticalAlign: "middle",
                          alignItems: "center",
                        }}
                      >
                        <Jazzicon
                          diameter={iconSize}
                          seed={jsNumberForAddress(legend.address)}
                        />
                        <div style={{ width: 10 }} />
                        {legend.address.substring(0, 15) + "..."}
                      </div>
                    </TableCell>
                  </Tooltip>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredLegends.length / rowsPerPage)}
        onChange={handleChangePage}
        variant="outlined"
        shape="rounded"
        className={classes.footer}
        classes={{
          ul: classes.paginationStyle,
        }}
        showFirstButton
        showLastButton
      />

      <FilterDialog
        filterDialogOpen={filterDialogOpen}
        onCloseFilterMenu={handleCloseFilterMenu}
      />
    </div>
  );
};

export default LeaderboardTable;
