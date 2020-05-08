/*
Primary loop module. Loops though all rooms and creeps and runs appropriate
tasks
*/

// import modules
const globals = require('globals');
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('prototype.market');

module.exports.loop = function() {
    // check for memory entries of dead creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // Run all generic creep logic
    // for each creep
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();
    }

    // Run all generic tower logic
    // find all towers
    const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        tower.defend();
    }

    // Run all generic spawn logic
    // for each spawn
    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].reuse();
        // check that spawn has a minCreeps object
        if (Game.spawns[spawnName].memory.minCreeps == undefined) {
            // if not, give it one
            Game.spawns[spawnName].memory.minCreeps = {
                harvester: 3,
                upgrader: 1,
                builder: 0,
                repairer: 1,
                miner: 2,
                hauler: 1,
                waller: 1};
        }
        // run spawn logic
        Game.spawns[spawnName].spawnCreepsIfNecessary();
        if (Game.cpu.bucket >= 5000) {
            Game.spawns[spawnName].marketSale();
            //Game.spawns[spawnName].sellOrder();
        }
        Game.spawns[spawnName].buildExtractor();
    }
};
