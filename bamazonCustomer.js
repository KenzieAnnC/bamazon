var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Iycdiycdi!",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    purchaseItem();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log(res);
        connection.end();
    });
}

function purchaseItem() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        readProducts();
        inquirer
            .prompt([

                {
                    name: 'productName',
                    type: 'input',
                    message: "Enter the ID of the product you'd like to buy"
                },
                {
                    name: 'productQuantity',
                    type: 'input',
                    message: 'How many would you like to purchse?',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ]);
    });
}