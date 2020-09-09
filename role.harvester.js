// Harvesters are the most basic form of gathering creeps. They spawn when Container
//  harvesting isn't possible yet due to low control level in the room or as a backup
//  when all miners are dead. Miners are the *improved* version of these thanks to
//  better efficiency.

// Primary function is to gather from sources and deliver energy to spawn/extentions.
//  Will bring energy to towers if those are full and if all is full will help
//  build/upgrade.

// import builder and upgrader scripts for when harvesting work is done.
var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        // Check working status
        creep.checkWorkingStatus();

        // First check if you need to be recycled
        if (creep.ticksToLive < 200 && creep.store.getUsedCapacity() == 0) {
            creep.memory.recycle = true
            creep.say('reuse me!');
            var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN)
            });
            if (creep.memory.recycle = true) {
                if (closestSpawn != null) {
                    if (creep.pos.getRangeTo(closestSpawn) > 1) {
                        creep.moveTo(closestSpawn, { reusePath: 50, maxOps: 500 });
                    }
                    else {
                        closestSpawn.recycleCreep(creep);
                    }
                }
            }
        }
        // Otherwise, get to work
        else {
            // if creep is supposed to transfer energy to a structure
            if (creep.memory.working == true) {
                // find closest spawn, extension or tower which is not full
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                        || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure, { reusePath: 10, maxOps: 500 });
                    }
                }
                else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 2500) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure, { reusePath: 10, maxOps: 500 });
                    }
                }
                else {
                    roleBuilder.run(creep);
                }
            }
            // if creep is supposed to harvest energy from source
            else {
                creep.getEnergy(true, true, true);
            }
        }  
    }
};
