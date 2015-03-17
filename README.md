# chipotle

Order a burrito from chipotle with the cli!

Interesting way to gain some knowledge of casper.js for integration testing.

## Caution

If you answer yes to "Is this a live order?" it really does place a real order go pick it up.

## Prerequisites

A Chipotle account

Then run...

`brew install phantomjs`

`brew install casperjs --devel`

## Getting Started

Install with: `sudo npm install cli-burrito-maker -g`

## Place an Order
After doing: npm install cli-burrito-maker -g

New order or first time simply type: 'burrito' and the program will guide you through making your burrito selections.

At the end of your order you will be prompted to save these preferences in a config file.

If you would like to order from with an existing order config, simply type the burrito command and the name of your config file: `burrito myway`

Limitations:  Current implementation supports one burrito at a time, requires an account and only supports burritos.

## License
Copyright (c) 2015 Erik Scott  
Licensed under the MIT license.
