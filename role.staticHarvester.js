// STILL IN DEVELOPMENT!
//
// Currently working to integrate into main code
//
module.exports = {
  // a function to run the logic for this role
  /** @param {Creep} creep **/
  run: function(creep) {
    // find all containers in room  that aren't full
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER)
        && (structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
        }
    });

    // if not on container
    if(targets.length > 0) {
      // if on container number 0, then harvest
      if(creep.pos.getRangeTo(targets[0]) == 0) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
          creep.harvest(source);
      }
      // go to container number 1
      else {
        creep.moveTo(targets[1]);
        if(creep.pos.getRangeTo(targets[1]) == 0) {
          var source = creep.pos.findClosestByPath(FIND_SOURCES);
            creep.harvest(source);
        }
      }
    }
  }
};
