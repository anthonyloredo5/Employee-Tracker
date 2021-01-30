const inquirer = require('inquirer');
const logo = require('asciiart-logo');
const { response } = require('express');
require('console.table');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employees'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
    init();

});



function init() {
    const logoText = logo({ name: "Employee Tracker" }).render();
    console.log(logoText);
    loadMainMenu();
}

function loadMainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'value',
                message: 'What would you like to do?',
                choices: [
                    'View Employee Data',
                    'Add to Employee Data',
                    'Update existing Employee Data'
                ]
            }
        ]).then((response) => {
            switch (response.value) {
                case 'View Employee Data':
                    console.log('View Employee Data');
                    viewEmployeeData();
                    break;
                case 'Add to Employee Data':
                    console.log('Add to Employee Data');
                    addEmployeeData();
                    break;
                default:
                    console.log('Update existing Employee Data');
                    connection.query("SELECT * FROM employee", function (err, data) {
                        if (err) throw err
                        console.log("Current Employee Data");
                        console.table(data);
                        updateEmployeeData();
                    });
            }
        });
}

function viewEmployeeData() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'value',
                message: 'What data would you like to view?',
                choices: [
                    'View Departments',
                    'View Roles',
                    'View Employees'
                ]
            }
        ]).then((response) => {
            switch (response.value) {
                case 'View Departments':
                    connection.query("SELECT * FROM department", function (err, data) {
                        if (err) throw err
                        console.log("Department");
                        console.table(data);
                        loadMainMenu();
                    });
                    break;

                case 'View Roles':
                    connection.query("SELECT * FROM role", function (err, data) {
                        if (err) throw err
                        console.log("Role");
                        console.table(data);
                        loadMainMenu();
                    });
                    break;

                default:
                    connection.query("SELECT * FROM employee", function (err, data) {
                        if (err) throw err
                        console.log("Employee");
                        console.table(data);
                        loadMainMenu();
                    });
                    break;
            }
        });

}

function addEmployeeData() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'value',
                message: 'What data table would you like add to?',
                choices: [
                    'Departments',
                    'Roles',
                    'Employees'
                ]
            },
        ]).then((response) => {
            switch (response.value) {
                case 'Departments':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: 'Please enter the name you would like to insert.',
                        },
                    ]).then((response) => {
                        var name = response.name;
                        connection.query('INSERT INTO department (name) VALUES ("' + name + '")', function (err, data) {
                            if (err) throw err
                            loadMainMenu();
                        });
                    })
                    break;
                case 'Roles':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'title',
                            message: 'Please enter the title you would like to insert into table roles.',
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Please enter the salary you would like to insert into table roles.',
                        },
                        {
                            type: 'input',
                            name: 'id',
                            message: 'Please enter the department id you would like to insert into table roles.',
                        },
                    ]).then((response) => {
                        var title = response.title;
                        var salary = parseFloat(response.salary);
                        var id = parseInt(response.id);
                        connection.query('INSERT INTO role (title, salary, department_id) VALUES ("' + title + '", ' + salary + ', ' + id + ')', function (err, data) {
                            if (err) throw err
                            loadMainMenu();
                        });

                    })
                    break;
                default:
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'Please enter the employees first name.',
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'Please enter the employees last name name.',
                        },
                        {
                            type: 'input',
                            name: 'roleId',
                            message: 'Please enter the employees role id.',
                        },
                        {
                            type: 'input',
                            name: 'managerId',
                            message: 'Please enter the employees manager id.',
                        },
                    ]).then((response) => {
                        var firstName = response.firstName;
                        var lastName = response.lastName;
                        var roleId = parseInt(response.roleId);
                        var managerId = parseInt(response.managerId);

                        console.log('Employee');
                        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + firstName + '", "' + lastName + '", ' + roleId + ', ' + managerId + ')', function (err, data) {
                            if (err) throw err
                            loadMainMenu();
                        });
                    })
                    break;
            }
        })

}

function updateEmployeeData() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'value',
                message: 'Which employee data would you like to update by id?',
            },
            {
                type: 'list',
                name: 'change',
                message: 'What would you like to change?',
                choices:[
                    'first_name',
                    'last_name',
                    'role_id',
                    'manager_id'
                ]
            },
            {
                type: 'input',
                name: 'nValue',
                message: 'What is the new value?',
            },
        ]).then((response) => {
            var id = parseInt(response.value);
            var change = response.change;
            var nValue = response.nValue;
            connection.query('UPDATE employee SET '+change+' = "'+nValue+'" WHERE id = '+id+'', function (err, data) {
                if (err) throw err
                loadMainMenu();
            });

        })
}

