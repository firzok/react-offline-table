# react-offline-table

> An offline react table with the ability to sort and filter

[![NPM](https://img.shields.io/npm/v/react-offline-table.svg)](https://www.npmjs.com/package/react-offline-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Example


[https://firzok.github.io/react-offline-table/](https://firzok.github.io/react-offline-table/)


## Install

```bash
npm install --save react-offline-table
```

## Usage

```jsx
import React, { Component } from 'react'

import { headerFields, employeeData, EmployeeStatus, pages, colors } from './static_lists';

import OfflineTable from 'react-offline-table';

import moment from 'moment';

import { faEye, faEdit } from '@fortawesome/free-regular-svg-icons';

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
            // const actions = [
            //     { icon: "fas fa-eye text-success-600 cursor-pointer mr-2", callBack: this.viewEmployee.bind(this, employeeData[i].emp_id) },
            //     { icon: "fas fa-edit text-info-600 cursor-pointer", callBack: this.editEmployee.bind(this, employeeData[i].emp_id) }
            // ]
            const actions = [
                { icon: faEye, className: "text-success-600 cursor-pointer mr-2", callBack: this.viewEmployee.bind(this, employeeData[i].emp_id) },
                { icon: faEdit, className: "text-success-600 cursor-pointer mr-2", callBack: this.editEmployee.bind(this, employeeData[i].emp_id) }
            ]
            row.push(actions)

            // Column 2
            row.push({ text: "Change Status", selected: employeeData[i].status, options: EmployeeStatus, onClick: this.changeStatus, onClickArg: employeeData[i] })

            // Column 3
            row.push(employeeData[i].emp_id ? employeeData[i].emp_id : "N/A");

            // Column 4
            const avatar = { topText: employeeData[i].name, bottomText: employeeData[i].played_by, picture: employeeData[i].profile_picture };
            row.push(avatar)

            // Column 5
            row.push((employeeData[i].dob === "" || employeeData[i].dob === null) ? 'N/A' : moment(employeeData[i].dob).format("YYYY-MM-DD"));

            // Column 6
            if (employeeData[i].status === "Support") {
                row.push({ class: "badge badge-info text-capitalize", data: "Support" });
            }
            else if (employeeData[i].status === "Main") {
                row.push({ class: "badge badge-success text-capitalize", data: "Main" });
            }
            else if (employeeData[i].status === "Villain") {
                row.push({ class: "badge badge-danger text-capitalize", data: "Villain" });
            }
            _data.push(row);
        }




        return (
            <div>
                <OfflineTable
                    headerFields={ headerFields }
                    headerText={ "Offline React Table" }
                    data={ _data }
                    showSno={ false }
                    enableFilter={ true }
                    pages={ pages }
                    colors={ colors }
                />
            </div>
        )
    }
}



```




## License

MIT © [firzok](https://github.com/firzok)
