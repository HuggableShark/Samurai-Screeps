var roleRepairer = require('role.repairer');

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
            // find closest tower, container, or extension which is not full
            var warehouse = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                             || s.structureType == STRUCTURE_STORAGE)
                             && s.store.energy < s.storeCapacity
            });
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (t) => (t.structureType == STRUCTURE_TOWER)
                             && t.energy < t.energyCapacity
            });
            // if we found one
            if (tower != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(tower);
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
        // if creep is supposed to harvest energy from source
        else if (creep.memory.working == false) {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
        }
        // If everything is full, go build
        else {
            roleRepairer.run(creep);
        }
    }
};
