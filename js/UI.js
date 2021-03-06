var OregonH = OregonH || {};

OregonH.UI = {};

//show a notification in the message area
OregonH.UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.caravan.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

//show a notification in the message area
OregonH.UI.lineBreak = function(){
  document.getElementById('updates-area').innerHTML = '<br/>' + document.getElementById('updates-area').innerHTML;
};

//refresh visual caravan stats
OregonH.UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-day').innerHTML = Math.ceil(this.caravan.day);
  document.getElementById('stat-distance').innerHTML = Math.floor(this.caravan.distance)/10 + '%';
  document.getElementById('stat-crew').innerHTML = this.caravan.crew;
  document.getElementById('stat-oxen').innerHTML = this.caravan.oxen;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.caravan.food);
  document.getElementById('stat-money').innerHTML = this.caravan.money;
  document.getElementById('stat-firepower').innerHTML = this.caravan.firepower;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.caravan.weight) + '/' + this.caravan.capacity;

  //update caravan position
  document.getElementById('caravan').style.left = (380 * this.caravan.distance/OregonH.FINAL_DISTANCE) + 'px';
};

// offer shop
OregonH.UI.offerShop = function(products){
  var attackDiv = document.getElementById('offer-shop');
  attackDiv.classList.remove('hidden');

  this.offered = true;

  //keep properties
  this.products = products;

console.log('Productions in OfferShop')
console.log(products[0]);
console.log(products[1]);
console.log(products[2]);
console.log(products[3]);

  document.getElementById('offer-buy').addEventListener('click', this.showShop.bind(this));
  document.getElementById('offer-home').addEventListener('click', this.stayHome.bind(this));
};

OregonH.UI.stayHome = function(){
  console.log('In Stay Home');
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();
}

//show shop
OregonH.UI.showShop = function(products){
  console.log('In Show Shop');

  // Check has shop been offered
  if (this.offered){
    products = this.products;
  }
  this.offered = false;

  document.getElementById('offer-shop').classList.add('hidden');
  this.game.pauseJourney();
  //get shop area
  var shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  //init the shop just once
  if(!this.shopInitiated) {

    //event delegation
    shopDiv.addEventListener('click', function(e){
      //what was clicked
      var target = e.target || e.src;

      //exit button
      if(target.tagName == 'BUTTON') {
        //resume journey
        shopDiv.classList.add('hidden');
        OregonH.UI.game.resumeJourney();
      }
      else if(target.tagName == 'DIV' && target.className.match(/product/)) {

        var bought = OregonH.UI.buyProduct({
          stat: target.getAttribute('data-stat'),
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });

        if(bought) target.html = '';
      }
    });

    this.shopInitiated = true;
  }

  //clear existing content
  var prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  //show products
  var product;
  for(var i=0; i < products.length; i++) {
    product = products[i];
    prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '" data-stat="' + product.stat + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
  }

  //setup click event
  //document.getElementsByClassName('product').addEventListener(OregonH.UI.buyProduct);
};

//buy product
OregonH.UI.buyProduct = function(product) {
  //check we can afford it
  if(product.price > OregonH.UI.caravan.money) {
    OregonH.UI.notify('Not enough money', 'negative');
    return false;
  }

  OregonH.UI.caravan.money -= product.price;

  OregonH.UI.caravan[product.stat] += +product.qty;

  OregonH.UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update weight
  OregonH.UI.caravan.updateWeight();

  //update visuals
  OregonH.UI.refreshStats();

  return true;

};

//show attack
OregonH.UI.showAttack = function(firepower, gold) {
  var attackDiv = document.getElementById('attack');
  attackDiv.classList.remove('hidden');

  //keep properties
  this.firepower = firepower;
  this.gold = gold;

  //show firepower
  document.getElementById('attack-description').innerHTML = 'Assailants: ' + firepower;

  //init once
  if(!this.attackInitiated) {

    //fight
    document.getElementById('fight').addEventListener('click', this.fight.bind(this));

    //run away
    document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

    this.attackInitiated = true;
  }
};

//fight
OregonH.UI.fight = function(){

  var firepower = this.firepower;
  var gold = this.gold;

  var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

  this.lineBreak();
  //check there are survivors
  if(damage < this.caravan.crew) {
    this.caravan.crew -= damage;
    this.caravan.money += gold;
    this.notify('You lost ' + damage + ' health in the fight', 'negative');
    this.notify('Found $' + gold, 'gold');
    this.notify('**FIGHT**', 'neutral');
    this.lineBreak();
  }
  else {
    this.caravan.crew = 0;
    this.notify('Everybody died in the fight.\n At least you didn\'t die alone ', 'negative');
  }

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();
};

//runing away from enemy
OregonH.UI.runaway = function(){

  var firepower = this.firepower;

  var damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

  //check there are survivors
  if(damage < this.caravan.crew) {
    this.caravan.crew -= damage;
    this.notify('You lost ' + damage + ' health running.\n Not to mention damage to your self respect.', 'negative');
  }
  else {
    this.caravan.crew = 0;
    this.notify('You died running away', 'negative');
  }

  //remove event listener
  //document.getElementById('runaway').removeEventListener('click');

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();

};

OregonH.UI.collectDole = function(){
  this.caravan.money += 200;
  this.notify('You have collected €200 social welfare payment', 'positive');
  console.log('Collected Dole');
}
