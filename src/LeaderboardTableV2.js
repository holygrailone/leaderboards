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
  TablePagination,
  Paper,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import goldMedal from "./assets/goldmedal.png";
import { styled } from "@mui/material/styles";

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

const useStyles = makeStyles(() =>
  createStyles({
    goldStarIcon: {
      width: iconSize,
      height: iconSize,
      verticalAlign: "middle",
    },
    tableContainer: {
      width: "80%",
      margin: "auto",
    },
    tableHeader: {
      padding: 30,
      textAlign: "center",
      backgroundColor: "#3d3830",
      cursor: "pointer",
    },
    tableRow: {
      padding: 10,
      textAlign: "center",
      backgroundColor: "#363129",
    },
  })
);

const StyledPaper = styled(Paper)(() => ({
  width: "80%",
  margin: "auto",
  textAlign: "center",
  backgroundColor: "#363129",
}));

const baseCellStyle = {
  color: "white",
  whiteSpace: "nowrap",
  padding: tableCellPadding,
  verticalAlign: "middle",
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
  const classes = useStyles();
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

export default function LeaderboardTable() {
  const classes = useStyles();

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
            if (a.level === b.level) {
              // exp only important when level are the same
              return b.exp - a.exp;
            }
            return a.level > b.level ? -1 : 1;
          })
          .map((l, idx) => {
            return { ...l, rank: idx + 1 };
          });
        setLegends(newLegends);
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <StyledPaper>
      <TableContainer>
        <Table>
          <SortableTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />

          <TableBody>
            {legends
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((legend, index) => (
                <TableRow
                  key={index}
                  legends-item={legend}
                  className={classes.tableRow}
                >
                  <StyledTableCell legends-label="Rank" rank>
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

                  <StyledTableCell legends-label="Legend #" numeric>
                    {legend.legendid}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Gen" numeric>
                    {legend.gen}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Level" numeric>
                    {legend.level}
                  </StyledTableCell>

                  <StyledTableCell legends-label="XP" numeric>
                    {legend.xp}
                  </StyledTableCell>

                  <Tooltip title={legend.name} placement="right-start">
                    <StyledTableCell legends-label="Name">
                      {`${legend.name.substring(0, 20)}${
                        legend.name.length > 20 ? "..." : ""
                      }`}
                    </StyledTableCell>
                  </Tooltip>

                  <StyledTableCell legends-label="Title">
                    {legend.class}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Title">
                    {legend.title}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Gold" numeric>
                    {legend.gold}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Knowledge" numeric>
                    {legend.knowledge}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Minted" numeric>
                    {new Date(legend.minted * 1000)
                      .toLocaleDateString("en-US")
                      .toString()}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Banned">
                    {legend.banned.toString()}
                  </StyledTableCell>

                  <StyledTableCell legends-label="Owner">
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

      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={legends.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ color: "white" }}
      />
    </StyledPaper>
  );
}
