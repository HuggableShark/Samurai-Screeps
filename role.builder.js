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
          creep.moveTo(constructionSite, {reusePath: 10});
        }
      }
      // otherwise, help upgrade
      else {
        roleUpgrader.run(creep);
      }
    }

    // if creep is supposed to harvest energy from source
    else {
      let storage = creep.room.storage;
      // First get it from storage
      if (storage != undefined && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
        }
      }
      // otherwise, get it from containers/sources
      else {
        creep.getEnergy(true, true);
      }
    }
  }
};
