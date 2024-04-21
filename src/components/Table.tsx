import React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import AutoSuggestion from "./AutoSuggestion";
import { useDispatch } from "react-redux";
import { fetchedRows, selectRow } from "../reudx/actions";
import GradeIcon from "@mui/icons-material/Grade";
import { useNavigate } from "react-router-dom";

interface Data {
  id: number;
  name: string;
  cou_name_en: string;
  timezone: string;
  population: number;
  geoname_id: string;
}

interface City {
  geoname_id: string;
  name: string;
  cou_name_en: string | null;
  timezone: string;
  population: number;
}

interface CitiesData {
  total_count: number;
  results: City[];
}

function createData(
  id: number,
  name: string,
  cou_name_en: string,
  timezone: string,
  population: number,
  geoname_id: string
): Data {
  return {
    id,
    name,
    cou_name_en,
    timezone,
    population,
    geoname_id,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "name", numeric: false, disablePadding: true, label: "City Name" },
  { id: "cou_name_en", numeric: true, disablePadding: false, label: "Country" },
  { id: "timezone", numeric: true, disablePadding: false, label: "TimeZone" },
  {
    id: "population",
    numeric: true,
    disablePadding: false,
    label: "Population",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, searchQuery, setSearchQuery } = props;
  const navigate = useNavigate();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
      style={{position:'sticky',top:0,backgroundColor:'white',zIndex:1000,borderBottom:'1px solid grey'}}
    >
      <Typography
        component="div"
        sx={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        <Typography
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h4"
            id="tableTitle"
            component="div"
          >
            Cities Table
          </Typography>
          <Typography component="div">
            <AutoSuggestion
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </Typography>
         
          <Tooltip title="Favourite list">
            <IconButton onClick={() => navigate("/favourites")}>
              <GradeIcon color={"warning"} />
            </IconButton>
          </Tooltip>
        </Typography>
        {numSelected > 0 && (
          <Typography
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          ></Typography>
        )}
      </Typography>
    </Toolbar>
  );
}

export default function EnhancedTable(props: { cities: CitiesData }) {
  const { cities } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("cou_name_en");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (cities) {
      const updatedRows = cities.results.map((city, index) =>
        createData(
          index,
          city.name,
          city.cou_name_en ?? "Null",
          city.timezone,
          city.population,
          city.geoname_id
        )
      );
      setRows(updatedRows);
      dispatch(fetchedRows(updatedRows))
    }
  }, [cities]);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      const updatedRows = cities.results.map((city, index) =>
        createData(
          index,
          city.name,
          city.cou_name_en ?? "Null",
          city.timezone,
          city.population,
          city.geoname_id
        )
      );
      setRows(updatedRows);
    } else {
      const filteredRows = cities.results
        .filter((city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((city, index) =>
          createData(
            index,
            city.name,
            city.cou_name_en ?? "Null",
            city.timezone,
            city.population,
            city.geoname_id
          )
        );
      setRows(filteredRows);
    }
  }, [searchQuery, cities.results]);

  React.useEffect(() => {
    const storedSelectedRows = localStorage.getItem("selectedRows");
    if (storedSelectedRows) {
      setSelected(JSON.parse(storedSelectedRows));
    }
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, row: Data) => {
    const isSelected = selected.indexOf(row.id) !== -1;
    const newSelected = isSelected
      ? selected.filter((selectedId) => selectedId !== row.id)
      : [...selected, row.id];
    setSelected(newSelected);
    dispatch(selectRow(row));

    localStorage.setItem("selectedRows", JSON.stringify(newSelected));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2,pt:2, }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <IconButton
                          onClick={(event) => handleClick(event, row)}
                          aria-label="select"
                        >
                          <GradeIcon
                            color={isItemSelected ? "warning" : "inherit"}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={index.toString()}
                        scope="row"
                        padding="none"
                        onContextMenu={(event) => {
                          event.preventDefault();
                          window.open(
                            `/weather?id=${row.geoname_id}`,
                            "_blank"
                          );
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.cou_name_en}</TableCell>
                      <TableCell align="right">{row.timezone}</TableCell>
                      <TableCell align="right">{row.population}</TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
