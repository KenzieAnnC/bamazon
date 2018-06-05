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

connection.connect(function (err) {
    if (err) throw err;
    readProducts();
});


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (error, response) {
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].id);
            console.log("Name: " + response[i].product_name);
            console.log("Price: " + response[i].price);
            console.log('------------------------------------------------------');
        }
        if (error) throw error;
        // console.log(JSON.stringify(response, null, 2));
        // console.log(res.id + '\n' + "Name: " + res.product_name + '\n' + "Price: " + res.price);
        connection.end();
    });
    // purchaseItem();

}

function purchaseItem() {
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
}