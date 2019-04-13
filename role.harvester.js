// Harvesters are the most basic form of gathering creeps. They spawn when Container
//  harvesting isn't possible yet due to low control level in the room or as a backup
//  when all miners are dead. Miners are the *improved* version of these thanks to
//  better efficiency.

// Primary function is to gather from sources and deliver energy to spawn/extentions.
//  Will bring energy to towers if those are full and if all is full will help
//  build/upgrade.

// import builder and upgrader scripts for when harvesting work is done.
var roleBuilder = require('role.builder');
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
        // if still in early room control, help upgrade
        if (creep.room.controller.level < 3)
          roleUpgrader.run(creep);
        // if past early room control, help build first, then upgrade
        else {
          roleBuilder.run(creep);
        }
      }
    }
    // if creep is out of energy
    else {
      // find closest source
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      // try to harvest energy, if the source is not in range
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // move towards the source
        creep.moveTo(source);
      }

      // if at source and cannot harvest? May need to fix the ordering between
      //  warehouse vs source harvesting. Minimal timeframe when this collision occurs.
      else {
        // find a container/storage to grab energy from
        var warehouse = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
          filter: (s) => s.structureType == STRUCTURE_CONTAINER
                      || s.structureType == STRUCTURE_STORAGE
                      && (s.store.energy > 0)
        }))
        if (creep.withdraw(warehouse, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(warehouse);
        }
      }
    }
  }
};
