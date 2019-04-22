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
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
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
                    creep.moveTo(structure);
                }
            }
            else {
              roleBuilder.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
          creep.getEnergy(true, true);
        }
    }
};
