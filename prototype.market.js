StructureSpawn.prototype.marketSale =
    function () {
      if (this.room.terminal && (Game.time % 10 == 0)) {
          if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_KEANIUM] >= 5000) {
              var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_KEANIUM &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(200, this.room.name, order.roomName) < 400);
              console.log('Keanium buy orders found: ' + orders.length);
              if (orders.length > 0) {
                  orders.sort(function(a,b){return b.price - a.price;});
                  console.log('Best price: ' + orders[0].price);
                  console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                  if (orders[0].price >= 0.077) {
                      var result = Game.market.deal(orders[0].id, 200, this.room.name);
                      if (result == 0) {
                          console.log('Order completed successfully');
                      }
                  }
              }
          }
          if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_CATALYST] >= 5000) {
              var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_CATALYST &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(200, this.room.name, order.roomName) < 400);
              console.log('Catalyst buy orders found: ' + orders.length);
              if (orders.length > 0) {
                  orders.sort(function(a,b){return b.price - a.price;});
                  console.log('Best price: ' + orders[0].price);
                  console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                  if (orders[0].price >= 0.214) {
                      var result = Game.market.deal(orders[0].id, 200, this.room.name);
                      if (result == 0) {
                          console.log('Order completed successfully');
                      }
                  }
              }
          }
          if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_OXYGEN] >= 5000) {
              var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_OXYGEN &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(200, this.room.name, order.roomName) < 400);
              console.log('Oxygen buy orders found: ' + orders.length);
              if (orders.length > 0) {
                  orders.sort(function(a,b){return b.price - a.price;});
                  console.log('Best price: ' + orders[0].price);
                  console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                  if (orders[0].price >= 0.130) {
                      var result = Game.market.deal(orders[0].id, 200, this.room.name);
                      if (result == 0) {
                          console.log('Order completed successfully');
                      }
                  }
              }
          }
          if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_LEMERGIUM] >= 5000) {
              var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_LEMERGIUM &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(200, this.room.name, order.roomName) < 400);
              console.log('Lemurgium buy orders found: ' + orders.length);
              if (orders.length > 0) {
                  orders.sort(function(a,b){return b.price - a.price;});
                  console.log('Best price: ' + orders[0].price);
                  console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                  if (orders[0].price >= 0.100) {
                      var result = Game.market.deal(orders[0].id, 200, this.room.name);
                      if (result == 0) {
                          console.log('Order completed successfully');
                      }
                  }
              }
          }
         if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_HYDROGEN] >= 5000) {
              var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_HYDROGEN &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(200, this.room.name, order.roomName) < 400);
              console.log('Hydrogen buy orders found: ' + orders.length);
              if (orders.length > 0) {
                  orders.sort(function(a,b){return b.price - a.price;});
                  console.log('Best price: ' + orders[0].price);
                  console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                  if (orders[0].price >= 0.100) {
                      var result = Game.market.deal(orders[0].id, 200, this.room.name);
                      if (result == 0) {
                          console.log('Order completed successfully');
                      }
                  }
              }
          }
          if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_UTRIUM] >= 5000) {
               var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_UTRIUM &&
                                                     order.type == ORDER_BUY &&
                                                     Game.market.calcTransactionCost(200, this.room.name, order.roomName) < 400);
               console.log('Utrium buy orders found: ' + orders.length);
               if (orders.length > 0) {
                   orders.sort(function(a,b){return b.price - a.price;});
                   console.log('Best price: ' + orders[0].price);
                   console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                   if (orders[0].price >= 0.100) {
                       var result = Game.market.deal(orders[0].id, 200, this.room.name);
                       if (result == 0) {
                           console.log('Order completed successfully');
                       }
                   }
               }
           }
      }
  };
