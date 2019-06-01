// This creep is responsible for building up walls and ramparts. They have their
//  own role since there is SO much energy that can be dumped into them. Uses a %
//  over time to chose how much to add.

var roleBuilder = require('role.builder');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is trying to repair something but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to repair something
    if (creep.memory.working == true) {
      // find all walls in the room
      var borders = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_RAMPART
                    || s.structureType == STRUCTURE_WALL
      });
      // // find all ramparts in the room
      // var ramparts = creep.room.find(FIND_STRUCTURES, {
      //   filter: (s) => s.structureType == STRUCTURE_RAMPART
      // });

      var target = undefined;

      // loop with increasing percentages
      for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
        for (let border of borders) {
          if (border.hits / border.hitsMax < percentage) {
            target = border;
            break
          }
        }
        if (target != undefined) {
          // break the loop
          break;
        }
      }

      // if we find a wall that has to be repaired
      if (target != undefined) {
        // try to repair it, if not in range, go to it
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
      // if we can't find one
      else {
        // look for construction sites
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
