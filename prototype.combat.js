Creep.prototype.meleeHostile =
  function (hostile) {
    var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)  // redundant: remove in future, already called in func
    if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
      creep.moveTo(hostile);
    }
  }
