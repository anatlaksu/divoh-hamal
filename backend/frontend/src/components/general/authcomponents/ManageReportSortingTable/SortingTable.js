import React, { useMemo, useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNS } from "./coulmns";
import { GlobalFilter } from "./GlobalFilter";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { isAuthenticated } from "auth";

const SortingTable = ({ match }) => {
  const columns = useMemo(() => COLUMNS, []);
  const { user } = isAuthenticated();
  const [data, setData] = useState([]);
  //units

  const UserDelete = (UserId) => {
    axios
      .post(`http://localhost:8000/api/user/remove/${UserId}`)
      .then((response) => {
        loadUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadUsers = () => {
    axios
      .get("http://localhost:8000/api/usersvalidated")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   (async () => {
  //     console.log("================================================");
  //     console.log(user.personalnumber);
  //     const result = await axios.get(
  //       `http://localhost:8000/report/requestByPersonalnumber/${user.personalnumber}`
  //     );
  //     console.log(result);
  //     setData(result.data);
  //   })();
  // }, []);

  useEffect(() => {
    console.log(user.personalnumber);
    axios
      .get(`http://localhost:8000/report/requestByPersonalnumber/${user.personalnumber}`)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,

    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },

    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table-responsive" style={{ overflow: "auto" }}>
        <table id="table-to-xls-users" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th>
                    <div
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {" "}
                      {column.render("Header")}{" "}
                    </div>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                    <div>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "????"
                          : "??????"
                        : ""}
                    </div>
                  </th>
                ))}
                <th>????????</th>
                <th>??????????</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    if (
                      cell.column.id != "typevent" &&
                      cell.column.id != "pirot" &&
                      cell.column.id != "datevent" 
                    ) {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    } else {
                      if (cell.column.id == "typevent") {
                        if (cell.value == "1") return <td>?????????? ?????? ??????</td>;
                        if (cell.value == "2") return <td>??????????????</td>;
                        if (cell.value == "3") return <td>???????????? ????????</td>;
                        if (cell.value == "4") return <td>??????????</td>;
                        if (cell.value == "5") return <td>?????????? ?????? / ????????????</td>;
                        if (cell.value == "6") return <td>?????????? ?????????? ???????? ????"??</td>;
                        if (cell.value == "7") return <td>?????????? ??????????</td>;
                        if (cell.value == "8") return <td>??????????????</td>;
                        if (cell.value == "9") return <td>??????????</td>;
                        if (cell.value == "10") return <td>?????? ?????????????? ?????????? / ????"??</td>;
                        if (cell.value == "11") return <td>???? ???????? ???????? ??????????</td>;
                        if (cell.value == "12") return <td>??????</td>;
                        if (cell.value == "????'??") return <td>????"??</td>;
                      }
                      if (cell.column.id == "pirot") {
                        return(                          
                        <td>
                          {cell.value}
                        </td>
                        );
                      }

                      if (cell.column.id == "datevent") {
                        return (
                          <td>
                            {cell.value
                              .slice(0, 10)
                              .split("-")
                              .reverse()
                              .join("-")}
                          </td>
                        );
                      }
                    }
                  })}
                  {/* {console.log(row.original._id)} */}

                  <td role="cell">
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <Link to={`/editreport/${row.original._id}`}>
                        <button className="btn-new">????????</button>
                      </Link>{" "}
                    </div>{" "}
                    
                  </td>

                  {/*row.original._id=user._id*/}
                  <td role="cell">
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      {/* <button
                        className="btn-new-delete"
                        onClick={() => UserDelete(row.original._id)}
                      >
                        ??????????
                      </button> */}
                     <Link to={`/wachreport/${row.original._id}`}>
                        <button className="btn-new-delete">??????????</button>
                     </Link>{" "}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <span>
            ????????{" "}
            <strong>
              {pageIndex + 1} ???????? {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | ?????? ????????:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px", borderRadius: "10px" }}
            />
          </span>{" "}
          <select
            style={{ borderRadius: "10px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
export default withRouter(SortingTable);
