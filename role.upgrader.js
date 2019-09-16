// This creep's primary focus is to upgrade the room controller.

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is bringing energy to the controller but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to the controller
    if (creep.memory.working == true) {
      // instead of upgraderController we could also use:
      // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

      // try to upgrade the controller
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // if not in range, move towards the controller
        creep.moveTo(creep.room.controller, {reusePath: 10});
      }
    }
    // If creep needs energy
    else {
      let storage = creep.room.storage;
      // First get it from storage
      if (storage != undefined && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage, {reusePath: 10});
        }
      }
      // otherwise, get it from containers/sources
      else {
        creep.getEnergy(true, true);
      }
    }
  }
};
