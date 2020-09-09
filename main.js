// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('prototype.market');
require('prototype.room');
require('globals');

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
const profiler = require('screeps-profiler');



if (!(Memory.rooms)) {
    Memory.rooms = {};
}

profiler.enable();
module.exports.loop = function() {
    profiler.wrap(function() {
        // Run this every *blank* ticks
        if (Game.time % 20 == 0) {
            // check for memory entries of died creeps by iterating over Memory.creeps
            for (let name in Memory.creeps) {
                // and checking if the creep is still alive
                if (Game.creeps[name] == undefined) {
                    // if not, delete the memory entry
                    delete Memory.creeps[name];
                }
            }
        }
        if (Game.cpu.bucket < 7500) {
            console.log(Game.cpu.bucket);
        }
        
        // Iterate through all rooms and find rooms with your controllers
        _.forEach(Game.rooms, function (room) {
            // For each room that I have a controller in
            if (room && room.controller && room.controller.my == true) {
                room.addToMemory(room);
                if (Game.time % 5 == 0) {
                    room.findRepairs(room);
                }
                //room.checkRoomState(room);
                if (Game.cpu.bucket >= 5000) {
                    let roomName = room.name
                    room.marketSale(roomName);
                    //room.sellOrder(room);
                }
                room.buildExtractor(room);
                // Then iterate through spawns and  run spawn things
                for (let spawnName in room.memory.spawns) {
                    let spawnObject = Game.getObjectById(room.memory.spawns[spawnName])
                    if (spawnObject != null) {
                        if (!(spawnObject.memory.minCreeps)) {
                            spawnObject.memory.minCreeps = room.memory.minCreeps
                        }
                        //Game.spawns[spawnName].reuse()
                        // Create object with census of creeps currently in room
                        for (let role of listOfRoles) {
                            room.countRole(role);
                        }
                        if (Game.spawns[spawnName].spawning == null) {
                            Game.spawns[spawnName].spawnCreepsIfNecessary();
                            break;
                        }
                    }
                }
            }
            else {
                // delete room memory that we don't control
                delete room.memory
            }
        });

        // Run all generic tower logic
        // find all towers
        const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        // for each tower
        for (let tower of towers) {
            // run tower logic
            tower.defend();
        }

        // Run all generic creep logic
        // for each creeps
        for (let name in Game.creeps) {
            // run creep logic
            Game.creeps[name].runRole();
        }
    })
};