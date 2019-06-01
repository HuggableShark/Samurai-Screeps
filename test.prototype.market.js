// BEGINNER MARKET CODE, NEED TO REFACTOR FOR CODEBASE

// Terminal trade execution
if (this.room.terminal && (Game.time % 10 == 0)) {
    if (this.room.terminal.store[RESOURCE_ENERGY] >= 2000 && this.room.terminal.store[RESOURCE_KEANIUM] >= 2000) {
        var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_KEANIUM &&
                                              order.type == ORDER_BUY &&
                                              Game.market.calcTransactionCost(200, Game.spawns.Spawn1.room.name, order.roomName) < 400);
        console.log('Keanium buy orders found: ' + orders.length);
        orders.sort(function(a,b){return b.price - a.price;});
        console.log('Best price: ' + orders[0].price);
        console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
        if (orders[0].price > 0.7) {
            var result = Game.market.deal(orders[0].id, 200, spawn.room.name);
            if (result == 0) {
                console.log('Order completed successfully');
            }
        }
    }
}
