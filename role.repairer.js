var roleBuilder = require('role.builder');

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

    // Find all non-wall structures in order of HP
    if (creep.memory.working == true) {
      var structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax
                    && s.structureType != STRUCTURE_WALL
                    && s.structureType != STRUCTURE_RAMPART
      });

      if (structures != undefined) {
        if (creep.repair(structures) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structures);
        }
      }
      else {
        roleBuilder.run(creep);
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
