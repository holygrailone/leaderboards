import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { makeStyles, createStyles, useTheme, styled } from "@mui/styles";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import goldMedal from "./assets/goldmedal.png";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

const tableHeaders = [
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

const useLocalStyles = makeStyles((theme) =>
  createStyles({
    primaryColor: { color: theme.palette.primary.main },
    root: {
      width: "90vw",
      margin: "auto",
      textAlign: "center",
      color: "white",
      backgroundColor: theme.palette.background.main,
      marginTop: 0,
      marginBottom: 0,
      display: "grid",
      gridTemplateRows: "max-content 1fr max-content",
      alignItems: "start",
    },
    tableContainerPaper: {
      "&.MuiPaper-root": {
        backgroundColor: theme.palette.background.main,
        borderRadius: 0,
      },
    },
    goldStarIcon: {
      width: iconSize,
      height: iconSize,
      verticalAlign: "middle",
    },
    tableHeader: {
      padding: 30,
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
  })
);

const baseCellStyle = {
  color: "white",
  whiteSpace: "nowrap",
  padding: tableCellPadding,
};

const StyledTableCell = (props) => {
  const { rank, numeric } = props;

  if (rank) {
    return (
      <TableCell style={{ ...baseCellStyle, textAlign: "center" }}>
        {props.children}
      </TableCell>
    );
  }
  if (numeric) {
    return (
      <TableCell style={{ ...baseCellStyle, textAlign: "end" }}>
        {props.children}
      </TableCell>
    );
  }
  return <TableCell style={baseCellStyle}>{props.children}</TableCell>;
};

const SortableTableHead = (props) => {
  const classes = useLocalStyles();
  const theme = useTheme();
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
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
              style={{
                ...baseCellStyle,
                fontWeight: 600,
                fontSize: "1.1rem",
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
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
}));

const EnhancedTableToolbar = (props) => {
  const { filterText, handleFilterTextChange } = props;
  const theme = useTheme();
  const classes = useLocalStyles();

  return (
    <Toolbar className={classes.toolbar}>
      <Tooltip title="Search Name or Owner Address">
        <StyledTextField
          variant="outlined"
          size="small"
          value={filterText}
          onChange={handleFilterTextChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className={classes.primaryColor} />
              </InputAdornment>
            ),
          }}
          inputProps={{ style: { color: theme.palette.primary.main } }}
        />
      </Tooltip>

      {/* FILTER WIP
      <Tooltip title="Filter">
        <IconButton>
          <FilterListIcon className={classes.primaryColor} />
        </IconButton>
      </Tooltip> */}
    </Toolbar>
  );
};

export default function LeaderboardTable(props) {
  const { setNumLegends } = props;
  const classes = useLocalStyles();

  // pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // text filter
  const [filterText, setFilterText] = useState("");
  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  // fetch legends data
  const [legends, setLegends] = useState([]);
  useEffect(() => {
    axios
      .get("https://api.holygrail.one/legends.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        var newLegends = res.data
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
      });
  }, [setNumLegends]);

  const filteredLegends = legends.filter(
    (l) =>
      l.name.toLowerCase().includes(filterText.toLowerCase()) ||
      l.address.toLowerCase().includes(filterText.toLowerCase())
  );

  // sorting
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(tableHeaders[0].id);
  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar
        filterText={filterText}
        handleFilterTextChange={handleFilterTextChange}
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
                    <TableCell style={{ ...baseCellStyle }}>
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
    </div>
  );
}
