const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const { exit } = require("process");
const { stringify } = require("querystring");
const { REPL_MODE_STRICT } = require("repl");
// const { start } = require("repl");
// const { newEmp, delEmp, viewEmp } = require("./inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Mjkobe2324!",
  database: "emp_trackerdb",
  multipleStatements: true,
});
// connect
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});

connection.query = util.promisify(connection.query);


const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "startQ",
        message: "What would you like to do?",
        choices: [
          "View Employees",
          "View Departments",
          "View Roles",
          "Add Employee",
          "Delete Employee",
          "Update Employee roles",
          "Exit",
        ],
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "I need a value to continue";
          }
        },
      },
    ])
    .then(async (response) => {
      switch (response.startQ) {
        case "Add Employee":
          newEmp();
          break;

        case "Delete Employee":
          delEmp();
          break;
        case "View Employees":
          const emps = await view("employee");
          // console.table(emps);
          viewEmpAll();
          setTimeout(start, 2000);
          break;
        case "View Departments":
          const deps = await view("department");
          console.table(deps);
          setTimeout(start, 2000);
          break;
        case "View Roles":
          const roles = await view("role");
          console.table(roles);
          setTimeout(start, 2000);
          break;
        case "Update Employee roles":
          const roles2 = await view("role")
          updateEmp();
          //console.table(roles2);
         ;
          break;
        default:
          close();
          break;
      }
    });
};

const view = async (table) => {
  const data = await connection.query(`SELECT * FROM ${table}`);
  return data;
};

const newEmp = async () => {
  const roles = await view("role");
  const emps = await view("employee");
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is employee's first name?",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "I need employee's first name to continue";
          }
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "What is employee's last name?",
        validate: (value) => {
          if (value) {
            return true;
          } else {
            return "I need employee's last name to continue";
          }
        },
      },
      // {
      //   type: "input",
      //   name: "last_name",
      //   message: "What is employee's last name?",
      //   validate: (value) => {
      //     if (value) {
      //       return true;
      //     } else {
      //       return "I need employee's last name to continue";
      //     }
      //   },
      // },
      {
        type: "list",
        name: "role_id",
        message: "What is employee's position?",
        choices: roles.map((role) => ({ name: role.title, value: role.id })),
      },
    
      {
        type: "list",
        name: "manager_id",
        message: "What is their manager's id?",
        choices: emps.map((a) => ({
          name: a.first_name + " " + a.last_name,
          value: a.id,
        })),
    
      },
    ])
    .then(async (res) => {
      await connection.query("INSERT INTO employee SET ?", res);
      console.log("Success!");
      setTimeout(start, 2000);
    });
};
// function delEmp() {
//   let empList = [];
//   connection.query("SELECT employee.first_name, employee.last_name FROM employee", (err, res) => {
//     for (let i = 0; i < res.length; i++){
//       empList.push(res[i].first_name + " " + res[i].last_name);

//     }
//     inquirer
//       .prompt([
//         {
//           type: "list",
//           name: "employee",
//           message: "Which employee would you like to delete?",
//           choices: empList
//       },
//       ])
//       .then(function (res) {
//         const query = connection.query(`DELETE FROM employee WHERE concat(first_name, ' ', last_name) = '${res.employee}' `,
//           function (err, res) {
//             if (err) throw err;
//             console.log('Employee deleted!/n');
//             start();
//           });
//     })
//   })
// }
const delEmp = async () => {
  const emps = await view("employee");
  
  
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Who would you like to delete?",
        choices: emps.map((a) => ({
          name: a.first_name + " " + a.last_name,
          value: a.id,
        })),
      },
    ])
    .then(function (res) {
      connection.query(
        `DELETE FROM employee WHERE id = ${res.employee}`,
        function (err, res) {
          if (err) throw err;
          console.log("employee deleted");
          setTimeout(start, 2000);
        }
      );
     
    });
};

const viewEmpAll = () => {
  var viewAll =
    "SELECT employee.id, first_name, last_name, title, salary, name as department_name FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id;";
  
  connection.query(viewAll, (err, res) => {
    if (err) throw err;
    console.table(res);
 
  }
   
  );
};


const updateEmp = async() => {

  const roles = await view("role");
  const emps = await view("employee");
  inquirer
    .prompt([
      {
        type: "list",
        name: "empName",
        message: "Which employee's role would you like to change?",
        choices: emps.map((a) => ({
          name: a.first_name + " " + a.last_name,
          value: a.id,
        })),
      },
      {
        type: "list",
        name: "role",
        message: `What would you like his/her new role to be?`,
        choices: roles.map((role) => ({ name: role.title, value: role.id })),
      },
    ])
    .then(function (res) {
      connection.query(`UPDATE employee SET role_id = ${res.role} WHERE id = ${res.empName}`,
        function (err, res) {
          console.log('Employee role updated!');
          console.log(err)
        }
      );
       setTimeout(start, 2000);
    })
    //
}



const close = () => {
  connection.end();

  console.log("Have a nice day!")
}