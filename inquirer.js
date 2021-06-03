const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "list",
      name: "startQ",
      message: "What would you like to do?",
      choices: ["View Employees", "Add Employee", "Delete Employee"],
      validate: (value) => {
        if (value) {
          return true;
        } else {
          return "I need a value to continue";
        }
      },
    },
  ])
  .then(function (response) {
    if (response.startQ === "Add Employee") {
      addEmp();
    } else if (response.startQ === "Delete Employee") {
        delEmp()
    }
  });

  //questions to add employee to table
const addEmp = () => {
  inquirer.prompt([
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
    {
      type: "list",
      name: "emp_role",
      message: "What is employee's position?",
      choices: [
        "Engineer",
        "Manager",
        "Supervisor",
        "Sales",
        "Intern",
        "Web Dev",
        "Accountant",
      ],
      validate: (value) => {
        if (value) {
          return true;
        } else {
          return "I need you to choose a position to continue";
        }
      },
    },
    {
      type: "input",
      name: "emp_salary",
      message: "What is employee's salary?",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          return "I need employee's salary to continue";
        }
      },
    },
    {
      type: "input",
      name: "manager",
      message: "Who is his/her manager?",
      validate: (value) => {
        if (value) {
          return true;
        } else {
          return "I need employee's salary to continue";
        }
      },
    },
  ]);
};


//questions to delete employee

const delEmp = () => {

},
