var casper = require('casper').create(),
    fs = require('fs'),
    order = require('../orderConfigs/' + casper.cli.args[2] + ".json"),
    password = casper.cli.args[0],
    zipcode = casper.cli.args[1];


var casper = require('casper').create({
    pageSettings: {
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.10 (KHTML, like Gecko) Chrome/23.0.1262.0 Safari/537.10',
        webSecurityEnabled: false,
        "ignoreSslErrors": true
    }
});

// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

var url = 'https://www.chipotle.com/en-us/account/account.aspx';

casper.start(url, function() {
    // search for 'casperjs' from google form
    this.fill('form#aspnetForm', {
        'ctl00$ContentPlaceHolderMain$TextBoxSigninEmail': order.email,
        'ctl00$ContentPlaceHolderMain$TextBoxSigninPassword': password
    }, false);
});
casper.then(function() {
    this.click('#ctl00_ContentPlaceHolderMain_ImageButtonSignIn');
});

casper.waitForSelector('#ctl00_ContentPlaceHolderMain_LoginInfo1_LabelUserName', function() {
    console.log("Signed In!");
    //this.capture('receipts/AccountInfo.png');
});

casper.then(function() {
    this.click('#ctl00_ContentPlaceHolderMain_OrderNow1_HyperLinkOrderNow');
});

casper.waitForSelector('#PartialAddress', function() {
    //this.capture('receipts/SelectLocation.png');
    this.fill('form#searchForm', {
        'PartialAddress': zipcode
    }, false);
});

casper.then(function() {
    this.click('#findAddressSubmit > a');
});

casper.waitForSelector('.dvLocationInfo', function() {
    //this.capture('LocationList.png');
});

casper.then(function() {
    this.click('#restaurantViews .dvRestaurant:first-child .orderNow .culottes');
});

casper.waitForSelector('.dvContentOrder', function() {
    this.click('.itemList .itemContent:first-child input');
    console.log("Selected Location!");
});

casper.waitForSelector('.modsContentBody', function() {
    var filling = null;

    switch (order.filling) {
        case "chicken":
            filling = 2;
            break;

        case "steak":
            filling = 1;
            break;

        case "barbacoa":
            filling = 5;
            break;

        case "carnitas":
            filling = 3;
            break;

        case "sofritas":
            filling = 37;
            break;

        case "veggie":
            filling = 4;
            break;
    };
    this.click('.fillings input[data-itemid="' + filling + '"] ~ input');
    console.log("Selected Filling!");
});

casper.then(function() {
    var rice = null;
    switch (order.rice) {
        case "white":
            rice = 10001;
            break;

        case "brown":
            rice = 10021;
            break;

        case "none":
            rice = 999998;
            break;
    };
    this.click('.selections input[data-itemid="' + rice + '"]');
    console.log("Selected Rice!");
});

casper.then(function() {
    var beans = null;
    switch (order.beans) {
        case "black":
            beans = 10002;
            break;

        case "pinto":
            beans = 10003;
            break;

        case "none":
            beans = 999999;
            break;
    };
    this.click('.selections input[data-itemid="' + beans + '"]');
    console.log("Selected Beans!");
});

casper.then(function() {
    for (var i = 0, j = order.toppings.length; i < j; i++) {
        switch (order.toppings[i]) {
            case "Fajita Veggies":
                toppings = 10004;
                break;

            case "Fresh Tomato Salsa":
                toppings = 10005;
                break;

            case "Roasted Chili-Corn Salsa (medium)":
                toppings = 10006;
                break;

            case "Tomatillo-Green Chili Salsa (medium)":
                toppings = 10007;
                break;

            case "Tomatillo-Red Chili Salsa (hot)":
                toppings = 10008;
                break;

            case "Sour Cream":
                toppings = 10009;
                break;

            case "Cheese":
                toppings = 10010;
                break;

            case "Guacamole ($1.90)":
                toppings = 10;
                break;

            case "Lettuce":
                toppings = 10011;
                break;
        }
        this.click('.toppings .selections input[data-itemid="' + toppings + '"] ~ input');
        console.log("Selected Toppings!");
    }
    //this.capture('receipts/OrderMods.png');
});

casper.then(function() {
    this.click('#addToBag > a');
});

casper.wait(2000, function() {
    console.log("Added to Bag!");
    this.fill('#mealNameDialog', {
        'mealName': 'Burrito Time'
    }, false);
});

casper.then(function() {
    //this.capture('receipts/MealName.png');
    this.click('.textButton a.submit');
});

casper.waitForSelector('#checkout', function() {
    //this.capture("receipts/CheckoutReady.png");
    this.click('#checkout > .checkDirty');
});

casper.waitForSelector('#loginContent', function() {
    //this.capture("receipts/Login.png");
    this.fill('form#logonForm', {
        'Email': order.email,
        'Password': password
    }, false);
});

casper.then(function() {

    this.click('#logonButton');
});

casper.waitForSelector('#createPayment', function() {
    //this.capture("receipts/PaymentPreference.png");
    this.click("#rdCash");
});

casper.then(function() {
    this.click("#continueToReview > a");
});

casper.waitForSelector("#PickupTime", function() {
    //this.capture("receipts/ReviewOrder.png");
    // select the first time avail
    this.evaluate(function() {
        document.querySelector('#PickupTime').selectedIndex = 1; //it is obvious
        return true;
    });
    //this.click("#placeOrderButton > a"); // comment out for test order
    console.log("Ordering and Prininting Receipt!");
    this.wait(3000, function() {
        var d = new Date().toDateString().split(' ').join("-");
        this.capture("receipts/" + d + "-receipt.png");
    });
});


casper.run();