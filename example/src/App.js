import React, { Component } from 'react'

import { headerFields, employeeData, EmployeeStatus, pages, colors } from './static_lists';

import OfflineTable from 'react-offline-table';

import moment from 'moment';

export default class App extends Component {

  viewEmployee(selectedEmployeeID) {
    console.log("View Employee")
    console.log(selectedEmployeeID)
  }

  editEmployee(selectedEmployeeID) {
    console.log("Edit Employee")
    console.log(selectedEmployeeID)
  }

  changeStatus(newStatus, employee) {
    console.log("Status changed")
  }

  render() {

    var _data = []

    for (var i = 0; i < employeeData.length; i++) {
      var row = [];

      // Column 1
      const actions = [
        { icon: "fas fa-eye text-success-600 cursor-pointer mr-2", callBack: this.viewEmployee.bind(this, employeeData[i].emp_id) },
        { icon: "fas fa-edit text-info-600 cursor-pointer", callBack: this.editEmployee.bind(this, employeeData[i].emp_id) }
      ]
      row.push(actions)

      // Column 2
      row.push({ text: "Change Status", selected: employeeData[i].status, options: EmployeeStatus, onClick: this.changeStatus, onClickArg: employeeData[i] })

      // Column 3
      const avatar = { topText: employeeData[i].name, bottomText: employeeData[i].emp_id, picture: employeeData[i].profile_picture };
      row.push(avatar)

      // Column 4
      row.push(employeeData[i].designation ? employeeData[i].designation : "N/A");

      // Column 5
      row.push((employeeData[i].hire_date === "" || employeeData[i].hire_date === null) ? 'N/A' : moment(employeeData[i].hire_date).format("YYYY-MM-DD"));

      // Column 6
      row.push((employeeData[i].doc === "" || employeeData[i].doc === null) ? 'N/A' : moment(employeeData[i].doc).format("YYYY-MM-DD"));

      // Column 7
      if (employeeData[i].status.toLowerCase() === "probation") {
        row.push({ class: "badge badge-info text-capitalize", data: "Probation" });
      } else if (employeeData[i].status.toLowerCase() === "current") {
        row.push({ class: "badge badge-success text-capitalize", data: "Permanent" });
      }
      else if (employeeData[i].status.toLowerCase() === "onNotice") {
        row.push({ class: "badge badge-secondary text-capitalize", data: "On Notice" });
      }
      else if (employeeData[i].status.toLowerCase() === "resign") {
        row.push({ class: "badge badge-danger text-capitalize", data: "Resign" });
      }
      else if (employeeData[i].status.toLowerCase() === "layoff") {
        row.push({ class: "badge badge-warning text-capitalize", data: "Layoff" });
      }
      _data.push(row);
    }




    return (
      <div>
        <OfflineTable
          headerFields={headerFields}
          headerText={"Offline React Table"}
          data={_data}
          showSno={true}
          enableFilter={true}
          enableExport={true}
          exportHeader={{
            report: "employeesData"
          }}
          pages={pages}
          colors={colors}
        />
      </div>
    )
  }
}
