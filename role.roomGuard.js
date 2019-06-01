module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // combat test
    var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)

    if (hostile != undefined) {
      if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
        creep.moveTo(hostile);
      }
    }
    // end combat test

    if (hostile == undefined) {
      creep.memory.recycle = true
      var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN)
      });
      if (creep.memory.recycle = true) {
        if (creep.pos.getRangeTo(closestSpawn) > 1) {
        creep.moveTo(closestSpawn);
        }
      }
    }
  }
};
