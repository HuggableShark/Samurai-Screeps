/*
Body = 2x HEAL, 6x WORK, 16TOUGH, 6x MOVE =
*/
module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if NOT in target room
    if (creep.room.name != creep.memory.targetRoom) {
      // find exit to target room
      var exit = creep.room.findExitTo(creep.memory.targetRoom);
      // move to exit
      creep.moveTo(creep.pos.findClosestByRange(exit));
    }
    else {
      var enemyStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES)
      if (enemyStructures != null) {
        if (creep.dismantle(enemyStructures == ERR_NOT_IN_RANGE)) {
          creep.moveTo(enemyStructures);
        }
      }
    }
  }
};
