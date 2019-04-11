var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }


        // if creep is supposed to transfer energy to the spawn
        else if (creep.memory.working == true) {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(constructionSite != undefined) {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }

        // if creep is supposed to harvest energy from source or pull from store
        else {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            var warehouse = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
                            || s.structureType == STRUCTURE_STORAGE
                            && (s.store.energy > 0)
            }));
            if (creep.memory.working == false) {
                if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(warehouse);
                }
            }
            // try to harvest energy, if the source is not in range
            else {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
              }
            }
        }
    }
};
