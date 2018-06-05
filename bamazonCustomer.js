/////////////////////////////////////////////////
//        requiring things we need             //
/////////////////////////////////////////////////

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

/////////////////////////////////////////////////
//   connecting to sql to list products        //
/////////////////////////////////////////////////

connection.connect(function (error) {
    if (error) throw error;
    start();
});


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (error, response) {
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].id);
            console.log("Name: " + response[i].product_name);
            console.log("Price: " + response[i].price);
            console.log("Quantity: " + response[i].quantity);
            console.log('------------------------------------------------------');
        }
        if (error) throw error;
    });
}

function start() {
    readProducts();

    inquirer.prompt([
        {
            name: 'productID',
            type: 'input',
            message: "Enter the ID of the product you'd like to buy"
        },
        {
            name: 'productQuantity',
            type: 'input',
            message: 'How many would you like to purchase?',
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        console.log('Product = ' + answer.productID + '\nQuantity = ' + answer.productQuantity);

        var product = answer.productID;
        var orderQuantity = answer.productQuantity;
        var query = "SELECT * FROM bamazon_db.products";

        connection.query(query, { id: product }, function (error, response) {
            if (error) throw error;

            if (response.length === 0) {
                console.log('No such product! Enter a valid ID');
                readProducts();

            } else {

                if (orderQuantity <= response[0].quantity) {
                    console.log('Product ordered!');

                }
                else {
                    console.log("\n We dont have enough! Try aomething else");
                }
                updateQuantity(product, orderQuantity);
            }
        });
    });
}

function updateQuantity(productID, productUnits) {

    var query = "SELECT * FROM bamazon_db.products WHERE ?";

    connection.query(query, { id: productID }, function (error, response) {
        if (error) throw error;

        var newQuantity = response[0].quantity - productUnits;

        if (newQuantity < 0)
            newQuantity = 0;

        var newQuery = "UPDATE bamazon_db.products SET ? WHERE ?"

        connection.query(newQuery, [{ quantity: newQuantity }, { id: productID }], function (error, response) {
            readProducts();
            getTotalCost(productID, productUnits);
        });

    });
}

function getTotalCost(productID, productUnits) {
    connection.query("SELECT * FROM products WHERE ?", {
        id: productID
    }, function(error, response) {
        if (error) throw error;

        var totalCost = response[0].price * productUnits;
        console.log("Total cost is $ " + totalCost);

    });
}