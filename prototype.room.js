Room.prototype.countRole = function (role, roomName) {
    if (!Game.roles) {
        Game.roles = {};
        for (const roomName in Game.rooms) {
            Game.roles[roomName] = Game.roles[roomName] || {};
        }
        for (const name in Game.creeps) {
            const creep = Game.creeps[name]
            const roomName = creep.room.name;
            if (roomName != undefined) {
                Game.roles[roomName] = Game.roles[roomName] || {};
            }
            if (creep != undefined) {
                Game.roles[roomName][creep.memory.role] = (Game.roles[roomName][creep.memory.role] || 0) + 1;
            }
        }
    }
    return Game.roles[this.name][role] || 0;
}

Room.prototype.addToMemory = function (room) {
    // Add important things to memory
    if (!(room.memory.resourcesProduced)) {
        let mineralsObject = room.find(FIND_MINERALS)
        let mineralId = mineralsObject[0].id
        let mineralType = mineralsObject[0].mineralType
        room.memory.resourcesProduced = { mineralId, mineralType }
    }
    // Create spawns object in room memory if there isn't one
    if (!(room.memory.spawns)) {
        room.memory.spawns = {};
    }
    if (!(room.memory.containers)) {
        room.memory.containers = {};
    }
    // Update important structures in memory every 25 ticks
    if (Game.time % 25) {
        const roomSpawns = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN }
        });
        if (roomSpawns.length > 0) {
            let roomSpawnsIdOnlyArray = []
            for (spawn of roomSpawns) {
                let spawnId = spawn.id
                let spawnName = spawn.name
                room.memory.spawns[spawnName] = spawnId
            }
        }

        let containers = room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        });
        if (containers.length > 0) {
            let roomContainersOnlyArray = []
            for (container of containers) {
                roomContainersOnlyArray.push(container.id)
            }
            room.memory.containers = roomContainersOnlyArray;
        }
    }
    if (!(room.memory.minCreeps)) {
        // if not, give it one
        room.memory.minCreeps = {
            harvester: 3,
            upgrader: 1,
            builder: 0,
            repairer: 0,
            miner: 2,
            hauler: 1,
            waller: 1
        };
    }
    // // Create buy order memory object
    // if (room.terminal && Game.time % 50) {
    //     let roomMineral = Game.getObjectById(room.memory.resourcesProduced['mineralId'])
    //     let roomMineralType = roomMineral.mineralType
    //     let currentOrders = Game.market.getAllOrders(order => order.resourceType == roomMineralType
    //         && order.type == ORDER_BUY
    //         && Game.market.calcTransactionCost(200, room.name, order.roomName) < 400);
    //     room.memory.currentOrders = currentOrders
    // }
};

Room.prototype.buildExtractor = function (room) {
    let roomControlLevel = room.controller.level;
    if (roomControlLevel >= 6) {
        let extractorInRoom = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTRACTOR }
        });
        if (!extractorInRoom.length) {
            let [mineral] = room.find(FIND_MINERALS);
            room.createConstructionSite(mineral.pos, STRUCTURE_EXTRACTOR);
        }
    }
};


// WIP !!!!!!!!!!! Highest container in room for creeps to call upon in a tick
Room.prototype.checkRoomState = function (room) {
    if (!Game.cache) {
        Game.cache = {};
    }
    Game.cache[room] = Game.cache[room] || {};
    
    for (let container of room.memory.containers) {
        let containerObject = Game.getObjectById(container)
        Game.cache[room][containerObject] = Game.cache[room][containerObject] || {};
        console.log(Game.cache[room][containerObject])
    }
}

Room.prototype.findRepairs = function (room) {
    let structuresToFix = room.find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax * 0.85
            && s.structureType != STRUCTURE_RAMPART
            && s.structureType != STRUCTURE_WALL
    });
    if (structuresToFix.length > 0) {
        room.memory.structureToFix = structuresToFix[0].id
    }
}