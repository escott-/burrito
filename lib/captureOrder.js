var fs = require("fs"),
  inquirer = require("inquirer"),
  spawn = require("child_process").spawn,
  clc = require('cli-color');

if (process.argv.length > 2) {
  var questions = [{
    type: "password",
    name: "password",
    message: "What's your password",
    validate: function(value) {
      var pass = value.match(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid password";
      }
    }
  }, {
    type: "input",
    name: "zip",
    message: "What's your zipcode",
    validate: function(value) {
      var pass = value.match(/^\d{5}(?:[-\s]\d{4})?$/);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid zipcode";
      }
    }
  }];

  inquirer.prompt(questions, function(answers) {
    // check if file exist, if not display error
    var exists = fs.existsSync("./orderConfigs/" + process.argv[2] + ".json");

    if (exists) {
      var casper = spawn("casperjs", [__dirname + "/spawnOrder.js", answers.password, answers.zip, process.argv[2]]);

      casper.stdout.on("data", function(data) {
        console.log(clc.green("Status: " + data));
      });

      casper.stderr.on("data", function(data) {
        console.log("Error " + data);
      });

      casper.on("exit", function(code) {
        console.log("process exited with code " + code);
      });
    } else {
      console.log("This order name does not exists");
      // add some logic here
      // enter order name again or give option to proceed to create new order
    }

  });

} else {
  console.log("This will begin a new order and give you the option of saving for future use.");

  var questions = [{
    type: "input",
    name: "email",
    message: "What's your email",
    validate: function(value) {
      var pass = value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid email";
      }
    }
  }, {
    type: "password",
    name: "password",
    message: "What's your password",
    validate: function(value) {
      var pass = value.match(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid password";
      }
    }
  }, {
    type: "input",
    name: "zip",
    message: "What's your zipcode",
    validate: function(value) {
      var pass = value.match(/^\d{5}(?:[-\s]\d{4})?$/);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid zipcode";
      }
    }
  }, {
    type: "list",
    name: "filling",
    message: "Choose a filling (Hit Enter after selection)",
    choices: ["Chicken", "Steak", "Barbacoa", "Carnitas", "Sofritas", "Veggie"],
    filter: function(val) {
      return val.toLowerCase();
    }
  }, {
    type: "list",
    name: "rice",
    message: "Choose a rice (Hit Enter after selection)",
    choices: ["White", "Brown", "None"],
    filter: function(val) {
      return val.toLowerCase();
    }
  }, {
    type: "list",
    name: "beans",
    message: "Choose beans (Hit Enter after selection)",
    choices: ["Black", "Pinto (cooked with bacon)", "None"],
    filter: function(val) {
      return val.toLowerCase();
    }
  }, {
    type: "checkbox",
    name: "toppings",
    message: "What about the toppings (Hit Enter after selection(s))",
    choices: [{
      name: "Fajita Veggies",
    }, {
      name: "Fresh Tomato Salsa",
    }, {
      name: "Roasted Chili-Corn Salsa (medium)",
    }, {
      name: "Tomatillo-Green Chili Salsa (medium)",
    }, {
      name: "Tomatillo-Red Chili Salsa (hot)",
    }, {
      name: "Sour Cream",
    }, {
      name: "Cheese",
    }, {
      name: "Guacamole ($1.90)",
    }, {
      name: "Lettuce",
    }],
    validate: function(answer) {
      if (answer.length < 1) {
        return "You must choose at least one topping.";
      }
      return true;
    }
  }];

  inquirer.prompt(questions, function(answers) {

    var order = {
      "email": answers.email,
      "filling": answers.filling,
      "rice": answers.rice,
      "beans": answers.beans,
      "toppings": answers.toppings
    };
    inquirer.prompt([{
      type: "input",
      name: "name",
      message: "Please enter a name for this order for future use",
      validate: function(value) {
        var pass = value.match(/^[a-zA-Z]*$/);
        if (pass) {
          return true;
        } else {
          return "Please enter a valid name with only letters and no spaces";
        }
      }
    }], function(answer) {
      // check if name already exist
      fs.writeFile("orderConfigs/" + answer.name + ".json", JSON.stringify(order, null, 4), function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Order Data Saved!");
          var casper = spawn("casperjs", ["lib/spawnOrder.js", answers.password, answers.zip, answer.name]);

          casper.stdout.on("data", function(data) {
            console.log(clc.green("Status: " + data));
          });

          casper.stderr.on("data", function(data) {
            console.log("Err: " + data);
          });

          casper.on("exit", function(code) {
            //console.log("curl process exited with code " + code);
          });
        }
      });
    });


  });

}