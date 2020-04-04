var OregonH = OregonH || {};

OregonH.Event = {};

OregonH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Fell off bookshelf. Health: -'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Cabin Fever outbreak. Health: -'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Powercut defrosts freezer. Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Pick pockets steal $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'You cannot find Dark Side of the Moon. Media: -'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Food parcels have been airdropped into the garden. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Your Kale has come into season. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'You find a copy of Citizen Kane in the attic. New Media: '
  },
  // {
  //   type: 'SHOP',
  //   notification: 'neutral',
  //   text: 'You Brave a jouney to the shops',
  //   products: [
  //     {item: 'food', qty: 20, price: 10, stat: 'food'},
  //     {item: 'dvd', qty: 1, price: 20, stat: 'oxen'},
  //     {item: 'shovel', qty: 2, price: 10, stat: 'firepower'},
  //     {item: 'medical supplies', qty: 5, price: 80, stat: 'crew'}
  //   ]
  // },
  // {
  //   type: 'SHOP',
  //   notification: 'neutral',
  //   text: 'You have been visited by a travelling salesman',
  //   products: [
  //     {item: 'food', qty: 30, price: 10, stat: 'food'},
  //     {item: 'books', qty: 1, price: 20, stat: 'oxen'},
  //     {item: 'ice pick', qty: 2, price: 10, stat: 'firepower'},
  //     {item: 'bandages', qty: 10, price: 10, stat: 'crew'}
  //   ]
  // },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      {item: 'food', qty: 20, price: 10, stat: 'food'},
      {item: 'records', qty: 1, price: 10, stat: 'oxen'},
      {item: 'sawed off shotgun with pistol grip', qty: 2, price: 10, stat: 'firepower'},
      {item: 'morphine', qty: 5, price: 10, stat: 'crew'}
    ]
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Assholes are attacking you during your morning run - this is life now'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Scumbags have broken into your house assuming you are already dead!'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'A mob of angry villagers with tiki torches pitchforks are attcking your house'
  }
];

OregonH.Event.shopTypes = [
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have braved a journey to they shops',
    products: [
      {item: 'food', qty: 30, price: 120, stat: 'food'},
      {item: 'books', qty: 1, price: 40, stat: 'oxen'},
      {item: 'ice pick', qty: 2, price: 60, stat: 'firepower'},
      {item: 'bandages', qty: 10, price: 40, stat: 'crew'}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Risking it all you have decided to go to the shops',
    products: [
      {item: 'food', qty: 15, price: 90, stat: 'food'},
      {item: 'books', qty: 1, price: 30, stat: 'oxen'},
      {item: 'ice pick', qty: 2, price: 50, stat: 'firepower'},
      {item: 'bandages', qty: 10, price: 50, stat: 'crew'}
    ]
  }
];

OregonH.Event.generateShop = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.shopTypes.length);
  var eventData = this.shopTypes[eventIndex];

  //start shop eventTypes//pause game
  this.game.pauseJourney();

  //notify user
  this.ui.notify(eventData.text, eventData.notification);

  //number of products for sale
  // var numProds = Math.ceil(Math.random() * 4);
  var numProds = 4;
  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
    //random product
    // j = Math.floor(Math.random() * eventData.products.length);
    j = i;

    // FIXME: Double check this equation - update to make more practical in game
    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      stat: eventData.products[j].stat,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  console.log('Products in Offer Shop');
  console.log(products[0]);
  console.log(products[1]);
  console.log(products[2]);
  console.log(products[3]);

  //prepare event
  this.ui.offerShop(products);
};

OregonH.Event.generateEvent = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  var eventData = this.eventTypes[eventIndex];

  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
      this.stateChangeEvent(eventData);
  }

  //shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.shopEvent(eventData);
  }

  //attacks
  else if(eventData.type == 'ATTACK') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.attackEvent(eventData);
  }
};

OregonH.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.caravan[eventData.stat] >= 0) {
    this.caravan[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

OregonH.Event.shopEvent = function(eventData) {
  //number of products for sale
  // var numProds = Math.ceil(Math.random() * 4);
  var numProds = 4;
  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
    //random product
    // j = Math.floor(Math.random() * eventData.products.length);
    j = i;

    // FIXME: Double check this equation - update to make more practical in game
    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      stat: eventData.products[j].stat,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  this.ui.showShop(products);
};

//prepare an attack event
OregonH.Event.attackEvent = function(eventData){
  var firepower = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_FIREPOWER_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);

  this.ui.showAttack(firepower, gold);
};
