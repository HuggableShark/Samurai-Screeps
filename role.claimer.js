var roleBuilder = require('role.builder');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if NOT in target room
    if (creep.room.name != creep.memory.target) {
      // find exit to target room
      var exit = creep.room.findExitTo(creep.memory.target);
      // move to exit
      creep.moveTo(creep.pos.findClosestByRange(exit));
    }
    else {
      // try to claim controller
      if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // move to controller
        creep.moveTo(creep.room.controller);
      }
      else {
        roleBuilder.run(creep);
      }
    }
  }
};
