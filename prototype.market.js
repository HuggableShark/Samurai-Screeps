Room.prototype.marketSale = function (room) {
    if (room.terminal && (Game.time % 30 == 0)) {
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_KEANIUM] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_KEANIUM &&
                                                order.type == ORDER_BUY &&
                                                Game.market.calcTransactionCost(200, room, order.roomName) < 400);
            console.log('Keanium buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function(a,b){return b.price - a.price;});
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.045) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_CATALYST] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_CATALYST &&
                                                order.type == ORDER_BUY &&
                                                Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
            console.log('Catalyst buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function(a,b){return b.price - a.price;});
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.145) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_OXYGEN] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_OXYGEN &&
                                                order.type == ORDER_BUY &&
                                                Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
            console.log('Oxygen buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function(a,b){return b.price - a.price;});
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.070) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_LEMERGIUM] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_LEMERGIUM &&
                                                order.type == ORDER_BUY &&
                                                Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
            console.log('Lemurgium buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function(a,b){return b.price - a.price;});
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.080) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_HYDROGEN] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_HYDROGEN &&
                                                order.type == ORDER_BUY &&
                                                Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
            console.log('Hydrogen buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function(a,b){return b.price - a.price;});
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.080) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_UTRIUM] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_UTRIUM &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
            console.log('Utrium buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function(a,b){return b.price - a.price;});
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.065) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        if (room.terminal.store[RESOURCE_ENERGY] >= 2000 && room.terminal.store[RESOURCE_ZYNTHIUM] >= 5000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ZYNTHIUM &&
                order.type == ORDER_BUY &&
                Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
            console.log('Zynthium buy orders found: ' + orders.length);
            if (orders.length > 0) {
                orders.sort(function (a, b) { return b.price - a.price; });
                console.log('Best price: ' + orders[0].price);
                console.log('Order ID = ' + orders[0].id + ' in room ' + orders[0].roomName);
                if (orders[0].price >= 0.065) {
                    let result = Game.market.deal(orders[0].id, 200, room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
    }
};

Room.prototype.sellOrder = function (room) {
    if (room.terminal && (Game.time % 10 == 0)) {
        if (room.terminal.store[RESOURCE_ENERGY] >= 1000 && room.terminal.store[RESOURCE_OXYGEN] >= 5000) {
            let result = Game.market.createOrder({
                type: ORDER_SELL,
                resourceType: RESOURCE_OXYGEN,
                price: 0.098,
                totalAmount: 5000,
                roomName: room.name
            });
            if (result == 0) {
                console.log('Sell order for Oxygen placed in ' + room.name + 'for 0.098 credits');
            }
        }
    }
};

module.exports = {
    buyCPU: function() {
        let orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: SUBSCRIPTION_TOKEN })
        if (orders.length > 0) {
            orders.sort(function (a, b) { return a.price - b.price; });
            console.log('Best price: ' + orders[0].price);
            console.log('CPU Order ID = ' + orders[0].id);
            if (orders[0].price <= 480000) {
                let result = Game.market.deal(orders[0].id, 200);
                if (result == 0) {
                    console.log('CPU purchase completed successfully');
                }
            }
        }
    }
}