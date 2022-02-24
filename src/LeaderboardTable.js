// import "./App.css";
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
} from "@mui/material";
import { makeStyles, createStyles, useTheme } from "@mui/styles";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import goldMedal from "./assets/goldmedal.png";

const tableHeaders = [
  { label: "Rank", id: "rank", numeric: true },
  { label: "Legend #", id: "legendid", numeric: true },
  { label: "Generation", id: "gen", numeric: true },
  { label: "Level", id: "level", numeric: true },
  { label: "XP", id: "xp", numeric: true },
  { label: "Name", id: "name", numeric: false },
  { label: "Class", id: "class", numeric: false },
  { label: "Title", id: "title", numeric: false },
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
    root: {
      width: "80%",
      margin: "auto",
      textAlign: "center",
      color: "white",
      backgroundColor: theme.palette.background.main,
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
      padding: 12,
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

export default function LeaderboardTable(props) {
  const { setNumLegends } = props;
  const classes = useLocalStyles();

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
            // sort order: level / exp / mint number
            if (a.level === b.level) {
              // exp only important when level are the same
              // return a.exp > b.exp ? -1 : 1;
              if (a.exp === b.exp) {
                return b.legendid - a.legendid;
              }
              return b.exp - a.exp;
            }
            return b.level - a.level;
          })
          .map((l, idx) => {
            return { ...l, rank: idx + 1 };
          });
        setLegends(newLegends);
        setNumLegends(newLegends.length);
      });
  }, []);

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

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.tableContainerPaper}>
        <Table>
          <SortableTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />

          <TableBody>
            {legends
              .sort(getComparator(order, orderBy))
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((legend, index) => (
                <TableRow
                  key={index}
                  legends-item={legend}
                  className={classes.tableRow}
                >
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
                    <StyledTableCell>
                      {`${legend.name.substring(0, 20)}${
                        legend.name.length > 20 ? "..." : ""
                      }`}
                    </StyledTableCell>
                  </Tooltip>

                  <StyledTableCell>{legend.class}</StyledTableCell>

                  <StyledTableCell>{legend.title}</StyledTableCell>

                  <StyledTableCell numeric>{legend.gold}</StyledTableCell>

                  <StyledTableCell numeric>{legend.knowledge}</StyledTableCell>

                  <StyledTableCell numeric>
                    {new Date(legend.minted * 1000)
                      .toLocaleDateString("en-US")
                      .toString()}
                  </StyledTableCell>

                  <StyledTableCell>{legend.banned.toString()}</StyledTableCell>

                  <StyledTableCell>
                    <div
                      style={{
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
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(legends.length / rowsPerPage)}
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
