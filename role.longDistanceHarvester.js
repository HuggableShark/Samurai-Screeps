// Major errors with the screep logic in this role thus far. Screeps currently
// get stuck moving back and forth either in a random zone of the room or back
// and forth across the room borders.

module.exports = {
    // a function to run the logic for this role
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
            // if in home room
            if (creep.room.name == creep.memory.home) {
                // find long term storage
                var warehouse = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                                 || s.structureType == STRUCTURE_STORAGE)
                                 && s.store.energy < s.storeCapacity
                });
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
                // if we found one
                else if (warehouse != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(warehouse);
                    }
                }
            }
            // if not in home room...
            else {
                // find exit to home room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // if in target room
            if (creep.room.name == creep.memory.target) {
                // find source
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];

                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};
