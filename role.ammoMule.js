var roleBuilder = require('role.builder');

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
      var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (t) => (t.structureType == STRUCTURE_TOWER)
                    && t.energy < t.energyCapacity
      });
      // if we found one
      if (tower != undefined) {
        creep.say('Bringing ammo')
        // try to transfer energy, if it is not in range
        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(tower);
        }
      }
      // otherwise, help build/upgrade
      else {
        roleBuilder.run(creep);
      }

    }
    else {
      // find closest source
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      // find closest container with some energy in it
      var container = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    && (s.store.energy > 0)
      }));
      // if creep is supposed to get energy to transfer
      if (creep.memory.working == false) {
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards the container
          creep.moveTo(container);
        }
      }
      // try to harvest energy, if the source is not in range
      else if (creep.memory.working == false && container.length == 0) {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          // move towards the source
          creep.moveTo(source);
        }
      }
    }
  }
};
