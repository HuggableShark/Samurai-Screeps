module.exports = {
  // a function to run the logic for this role
  run: function(creep) {

    var roomToStrike = creep.memory.roomToStrike;
    var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)

    // if hostile is defined, attack
    if (hostile != undefined) {
      if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
        creep.moveTo(hostile);
      }
    }

    // if no hostile, go get recycled
    if (hostile == undefined) {
      creep.memory.recycle = true
      creep.moveTo(creep.pos.findClosestByPath((FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN)
      })));
    }

    // find exit to target room
    var exit = creep.room.findExitTo(creep.memory.target);
    // move to exit
    creep.moveTo(creep.pos.findClosestByRange(exit));
  }
};
