var roleUpgrader = require('role.upgrader');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if NOT in target room
    if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
      // find exit to target room
      var exit = creep.room.findExitTo(creep.memory.target);
      // move to exit
      creep.moveTo(creep.pos.findClosestByRange(exit));
      return;
    }
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


    // if creep is supposed to work on a construction site
    if (creep.memory.working == true) {
      // find a construction site
      var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      // if we find one, go to it and build
      if(constructionSite != undefined) {
        if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      }
      // otherwise, help upgrade
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
      if (creep.memory.working == false && warehouse != undefined) {
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
