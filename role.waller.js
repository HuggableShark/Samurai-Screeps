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
      var walls = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_WALL
      });
      // find all ramparts in the room
      var ramparts = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_RAMPART
      });

      var target = undefined;

      // loop with increasing percentages
      for (let percentage = 0.00001; percentage <= 1; percentage = percentage + 0.00001){
        for (let wall of walls) {
          if (wall.hits / wall.hitsMax < percentage) {
            target = wall;
            continue
          }
        }
        for (let rampart of ramparts) {
          if (rampart.hits / rampart.hitsMax < percentage) {
            target = rampart;
            break
          }
        }
        // if there is one
        if (target != undefined) {
          // break the loop
          break;
        }
      }

      // if we find a wall that has to be repaired
      if (target != undefined) {
        // try to repair it, if not in range
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(target);
        }
      }
      // if we can't fine one
      else {
        // look for construction sites
        roleBuilder.run(creep);
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      // find closest source
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      // find closest warehouse
      var warehouse = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    || s.structureType == STRUCTURE_STORAGE
                    && (s.store.energy > 0)
      }));
      // first: try to grab from a warehouse
      if (creep.memory.working == false) {
        if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(warehouse);
        }
      }
      // otherwise, harvest from a source
      else if (creep.memory.working == false && warehouse.length == 0){
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          // move towards the source
          creep.moveTo(source);
        }
      }
    }
  }
};
