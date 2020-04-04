import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function OfflineTable(props) {
  let sortByElement = props.headerFields.find(function (element) {
    if ("sort" in element) {
      return element.sort !== "sorting";
    }
  });

  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const [data, setData] = useState(props.data);
  const [totalRecords, _] = useState(data.length);

  const [headerFields, setHeaderFields] = useState(props.headerFields);
  const [sortBy, setSortBy] = useState(sortByElement.id);

  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [, updateState] = React.useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  var viewData = data.slice(0, size);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function onLimitChange(selected) {
    const skip = 0;
    const start = 0;
    const size = Number(selected.value);

    if (filterValue && filterValue.length > 0) {
      var end = filteredData.length >= size ? size : filteredData.length;
      viewData = filteredData.slice(start, end);
    } else {
      var end = data.length >= size ? size : data.length;
    }
    setActivePage(1);
    setSkip(skip);
    setSize(size);
  }

  function handlePageChange(pageNumber) {
    const skip = pageNumber * size - size;
    setActivePage(pageNumber);
    setSkip(skip);

    if (filterValue && filterValue.length > 0) {
      const end =
        filteredData.length > skip + size ? skip + size : filteredData.length;

      viewData = filteredData.slice(skip, end);
    } else {
      const end = totalRecords > skip + size ? skip + size : totalRecords;

      viewData = data.slice(skip, end);
    }
  }

  function filterData(e) {
    const filterText = e.target.value;
    const filterTextToCompare = filterText.toLowerCase();

    var filtered = [];

    if (filterTextToCompare && filterTextToCompare.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var row = data[i];

        for (var j = 0; j < row.length; j++) {
          var col = row[j];

          switch (headerFields[j].type) {
            case "media":
              if (
                col.topText.toLowerCase().includes(filterTextToCompare) ||
                col.bottomText.toLowerCase().includes(filterTextToCompare)
              ) {
                filtered.push(row);
              }

              break;
            case "text":
              if (String(col).toLowerCase().includes(filterTextToCompare)) {
                filtered.push(row);
              }

              break;

            case "badge":
              if (col.data.toLowerCase().includes(filterTextToCompare)) {
                filtered.push(row);
              }

              break;
            default:
              break;
          }
        }
      }

      setFilteredData(filtered);
    }

    if (filteredData.length > 0) {
      viewData = filteredData.slice(
        0,
        filteredData.length > 10 ? filteredData.length : 10
      );
    }
    setFilterValue(filterText);
    setSize(10);
    setSkip(0);
  }

  function sortByColumn(array, colIndex, ascending) {
    switch (headerFields[colIndex].type) {
      case "media":
        if (ascending) {
          array.sort(sortFunctionMediaAscending);
        } else {
          array.sort(sortFunctionMediaDescending);
        }
        break;
      case "text":
        if (ascending) {
          array.sort(sortFunctionTextAscending);
        } else {
          array.sort(sortFunctionTextDescending);
        }
        break;
      case "badge":
        if (ascending) {
          array.sort(sortFunctionBadgeAscending);
        } else {
          array.sort(sortFunctionBadgeDescending);
        }
        break;

      default:
        break;
    }

    function sortFunctionMediaAscending(a, b) {
      if (a[colIndex].topText === b[colIndex].topText) {
        return 0;
      } else {
        return a[colIndex].topText < b[colIndex].topText ? -1 : 1;
      }
    }

    function sortFunctionTextAscending(a, b) {
      if (a[colIndex] === b[colIndex]) {
        return 0;
      } else {
        return a[colIndex] < b[colIndex] ? -1 : 1;
      }
    }

    function sortFunctionBadgeAscending(a, b) {
      if (a[colIndex].data === b[colIndex].data) {
        return 0;
      } else {
        return a[colIndex].data < b[colIndex].data ? -1 : 1;
      }
    }

    function sortFunctionMediaDescending(a, b) {
      if (a[colIndex].topText === b[colIndex].topText) {
        return 0;
      } else {
        return a[colIndex].topText > b[colIndex].topText ? -1 : 1;
      }
    }

    function sortFunctionTextDescending(a, b) {
      if (a[colIndex] === b[colIndex]) {
        return 0;
      } else {
        return a[colIndex] > b[colIndex] ? -1 : 1;
      }
    }

    function sortFunctionBadgeDescending(a, b) {
      if (a[colIndex].data === b[colIndex].data) {
        return 0;
      } else {
        return a[colIndex].data > b[colIndex].data ? -1 : 1;
      }
    }

    return array;
  }

  function sort(index) {
    var newData = headerFields[index];
    newData.sort =
      newData.sort === "sorting_asc" ? "sorting_desc" : "sorting_asc";
    headerFields[index] = newData;

    var sortedData;
    if (filterValue.length) {
      sortedData = sortByColumn(
        filteredData,
        index,
        newData.sort === "sorting_asc"
      );
      setFilteredData(sortedData);
    } else {
      sortedData = sortByColumn(data, index, newData.sort === "sorting_asc");
      setData(sortedData);
    }

    setHeaderFields(headerFields);
    setSortBy(index);

    forceUpdate();
  }

  function renderHeader() {
    for (let i = 0; i < headerFields.length; i++) {
      if (headerFields[i].sort) {
        headerFields[i].sort =
          headerFields[i].id === sortBy ? headerFields[i].sort : "sorting";
      }
    }
    var header = [];
    if (props.showSno) {
      header.push(
        <th role="row" key={"a" + Date.now() + Math.random() + Math.random()}>
          {"Sno."}
        </th>
      );
    }
    headerFields.forEach((element) => {
      //console.log(element.name, ('sort' in element) ? element.sort : null);
    });
    header.push(
      headerFields.map((row, idx) => (
        <th
          role="row"
          key={"b" + Date.now() + Math.random() + Math.random()}
          className={` ${row.align ? row.align : ""} ${
            "sort" in row ? row.sort : ""
          }`}
          // className={row.sort}
          tabIndex={idx}
          onClick={row.sort ? () => sort(idx) : null}
        >
          {row.name}
        </th>
      ))
    );

    return (
      <thead>
        <tr role="row">{header}</tr>
      </thead>
    );
  }

  function onClickExport() {
    const headers = props.exportHeader;

    setIsDownloadingSample(true);
    axios
      .get(EXPORT, { headers })
      .then((res) => {
        window.open("http://" + res.data.url);
        setIsDownloadingSample(false);
      })
      .catch((error) => {
        setIsDownloadingSample(false);
        var message = "Error occurred while downloading Template!";
        if ("response" in error) {
          message = error.response.data.Message;
        }
        Notifications.notify(message, "Error", "error");
      });
  }

  function renderDataInRows() {
    return viewData.map((row, index) => {
      var thisRow = [];

      if (props.showSno) {
        thisRow.push(
          <td key={"c" + Date.now() + Math.random() + Math.random()}>
            {index + 1}
          </td>
        );
      }

      if (props.showActions) {
        if (typeof action.icon === "string") {
          thisRow.push(
            <td
              className="text-center"
              key={"d" + Date.now() + Math.random() + Math.random()}
            >
              {props.actions.map((action, actionIdx) => (
                <i
                  key={"e" + Date.now() + Math.random() + Math.random()}
                  className={action.icon}
                  onClick={() => action.callBack(row)}
                />
              ))}
            </td>
          );
        } else {
          thisRow.push(
            <td
              className="text-center"
              key={"f" + Date.now() + Math.random() + Math.random()}
            >
              {props.actions.map((action, actionIdx) => (
                <FontAwesomeIcon
                  key={"g" + Date.now() + Math.random() + Math.random()}
                  icon={action.icon}
                  className={action.className ? action.className : ""}
                  onClick={() => action.callBack(row)}
                />
              ))}
            </td>
          );
        }
      }

      thisRow.push(
        row.map((col, subindex) => {
          var alignClass = headerFields[subindex].align
            ? headerFields[subindex].align
            : "";

          if (headerFields[subindex].type === "action") {
            thisRow.push(
              <td className="text-center" key={"rowtd" + subindex}>
                {col.map((action, actionIdx) => {
                  if (typeof action.icon === "string") {
                    return (
                      <i
                        key={"h" + Date.now() + Math.random() + Math.random()}
                        className={action.icon}
                        onClick={() => action.callBack(row)}
                      />
                    );
                  } else {
                    return (
                      <FontAwesomeIcon
                        key={"i" + Date.now() + Math.random() + Math.random()}
                        icon={action.icon}
                        className={action.className ? action.className : ""}
                        onClick={() => action.callBack(row)}
                      />
                    );
                  }
                })}
              </td>
            );
          } else if (headerFields[subindex].type === "badge") {
            return (
              <td
                className={"text-nowrap " + alignClass}
                key={"j" + Date.now() + Math.random() + Math.random()}
              >
                {" "}
                <span
                  key={"k" + Date.now() + Math.random() + Math.random()}
                  className={col.class}
                >
                  {col.data}
                </span>
              </td>
            );
          } else if (headerFields[subindex].type === "text") {
            return (
              <td
                className={alignClass}
                key={"l" + Date.now() + Math.random() + Math.random()}
              >
                {col}
              </td>
            );
          } else if (headerFields[subindex].type === "media") {
            const initials = col.topText.charAt(0).toLowerCase();

            const style = {
              backgroundColor: props.colors[initials],
            };

            var defaultProfilePicture = (
              <button
                className="btn rounded-round btn-icon btn-lg"
                style={style}
                key={"m" + Date.now() + Math.random() + Math.random()}
              >
                <span
                  className="letter-icon text-uppercase text-white"
                  key={"n" + Date.now() + Math.random() + Math.random()}
                >
                  {initials}
                </span>
              </button>
            );

            if (
              col.picture !== null &&
              col.picture !== "" &&
              typeof col.picture !== "undefined"
            ) {
              defaultProfilePicture = (
                <img
                  src={col.picture}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfilePicture;
                  }}
                  className="rounded-circle"
                  width="40"
                  height="40"
                  alt=""
                  key={"o" + Date.now() + Math.random() + Math.random()}
                />
              );
            }
            return (
              <td
                className={alignClass}
                key={"p" + Date.now() + Math.random() + Math.random()}
              >
                <div
                  className="media"
                  key={"q" + Date.now() + Math.random() + Math.random()}
                >
                  <div
                    className="ml-2 mr-2"
                    key={"r" + Date.now() + Math.random() + Math.random()}
                  >
                    {defaultProfilePicture}
                  </div>
                  <div
                    className="media-body"
                    key={"s" + Date.now() + Math.random() + Math.random()}
                  >
                    <div
                      className="font-weight-semibold text-capitalize"
                      key={"t" + Date.now() + Math.random() + Math.random()}
                    >
                      {col.topText}
                    </div>
                    <span
                      className="text-muted font-size-sm"
                      key={"u" + Date.now() + Math.random() + Math.random()}
                    >
                      {col.bottomText}
                    </span>
                  </div>
                </div>
              </td>
            );
          } else if (headerFields[subindex].type === "dropdown") {
            var dataLength = viewData.length;
            var dropdownClass = "";
            if (dataLength === 1) {
              dropdownClass = "c-dropdown-menu";
            }
            return (
              <td
                className="text-nowrap"
                key={"v" + Date.now() + Math.random() + Math.random()}
              >
                <div
                  className="list-icons-item dropdown"
                  key={"w" + Date.now() + Math.random() + Math.random()}
                >
                  <a
                    href="#"
                    className="list-icons-item dropdown-toggle"
                    style={{ color: "#22a2b1" }}
                    data-toggle="dropdown"
                    aria-expanded="false"
                    key={"x" + Date.now() + Math.random() + Math.random()}
                  >
                    {col.text}
                  </a>
                  <div
                    key={"y" + Date.now() + Math.random() + Math.random()}
                    className={`dropdown-menu ${dropdownClass}`}
                    x-placement="bottom-start"
                    style={{
                      position: "absolute",
                      willChange: "transform: top: 0px; left: 0px",
                      transform: "translate3d(0px, 16px, 0px)",
                    }}
                  >
                    {col.options.map((status, idx) => {
                      var __style = { color: "#22a2b1" };
                      var __text = (
                        <i
                          className="ml-auto icon-checkmark2"
                          style={__style}
                          key={"z" + Date.now() + Math.random() + Math.random()}
                        ></i>
                      );
                      if (status.value != col.selected) {
                        __style = {};
                        __text = "";
                      }
                      return (
                        <span
                          key={
                            "aa" + Date.now() + Math.random() + Math.random()
                          }
                          onClick={col.onClick.bind(
                            this,
                            status.value,
                            col.onClickArg
                          )}
                          className="dropdown-item"
                          style={__style}
                        >
                          {" "}
                          {status.label} {__text}{" "}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </td>
            );
          }
        })
      );

      return (
        <tr key={"ab" + Date.now() + Math.random() + Math.random()}>
          {thisRow}
        </tr>
      );
    });
  }

  function renderFilter() {
    const data = headerFields;
    const totalFields = viewData.length;

    if (props.enableFilter) {
      return (
        <div className="datatable-header row">
          <div className="dataTables_filter" title="Filter data">
            <label>
              <span className="ml-2">Filter:</span>
              <input
                type="search"
                value={filterValue}
                placeholder={"Type to filter..."}
                onChange={(e) => {
                  filterData(e);
                }}
              />
            </label>
          </div>

          <div className={`col-lg-2 col-xl-1 ml-1 ml-auto`}>
            <div className="form-group" title="Records Per Page">
              <Select
                value={props.pages.find((option) => option.value === size)}
                valueKey="value"
                labelKey="label"
                onChange={onLimitChange}
                options={props.pages}
                clearable={false}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="datatable-header">
          <div className="col-lg-3 col-xl-2 ml-auto">
            <div className="form-group" title="Records Per Page">
              <Select
                value={props.pages.find((option) => option.value === size)}
                valueKey="value"
                labelKey="label"
                onChange={onLimitChange}
                options={props.pages}
                clearable={false}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  var showHeaderText = props.headerText ? (
    <div className="card-body">{props.headerText}</div>
  ) : (
    ""
  );

  if (filterValue.length > 0) {
    viewData = filteredData.slice(
      skip,
      skip + size > filteredData.length ? filteredData.length : size
    );
  } else {
    viewData = data.slice(skip, skip + size);
  }

  var showingTo =
    skip +
    (filterValue.length > 0
      ? filteredData.length
      : viewData.length < activePage * size
      ? viewData.length
      : size);
  return (
    <div>
      {renderFilter()}

      <div className="card-header header-elements-inline">
        <h5 className="card-title">{props.title}</h5>
        <div className="header-elements">
          {/* <div className="list-icons">
                            <a className="list-icons-item" data-action="reload"></a>
                        </div> */}
        </div>
      </div>

      {showHeaderText}
      <div className="table-responsive c-table-responsive">
        <table className="table table-bordered table-hover datatable-highlight dataTable no-footer">
          {renderHeader()}
          <tbody>{renderDataInRows()}</tbody>
        </table>
      </div>
      <div className="row c-mt10 m-1">
        <div className="col-sm-12 col-md-6">
          <div className="records-info" role="status" aria-live="polite">
            {`Showing ${skip + 1} to ${showingTo} of ${
              filterValue.length > 0 ? filteredData.length : data.length
            } records`}
          </div>
        </div>
        <div className="col-sm-12 col-md-6 pagination-parent c-mt5r">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={size}
            totalItemsCount={
              filterValue.length > 0 ? filteredData.length : data.length
            }
            pageRangeDisplayed={5}
            onChange={(e) => handlePageChange(e)}
            itemClass={"page-item"}
            linkClass={"page-link"}
            prevPageText={"prev"}
            nextPageText={"next"}
            innerClass={"pagination"}
            activeClass={"active"}
          />
        </div>
      </div>
    </div>
  );
}

export default OfflineTable;
