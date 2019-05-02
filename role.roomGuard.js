module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // combat test
    var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)

    if (hostile != undefined) {
      creep.meleeHostile(hostile);
    }
    // end combat test

    if (hostile == undefined) {
      if (creep.ticksToLive < 200) {
        creep.memory.recycle = true
        creep.moveTo(creep.room.findClosestByPath(STRUCTURE_SPAWN));
      }
    }
  }
};
