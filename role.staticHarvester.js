// STILL IN DEVELOPMENT!
//
// Currently working to integrate into main code
//
//
//
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

    // while not on container
    if(targets.length > 0) {
      // if on container, then harvest
      if(creep.pos.getRangeTo(targets[0]) == 0) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
          creep.harvest(source);
      }
      // go to container to sit on
      else {
        creep.moveTo(targets[0]);
      }
    }
  }
};
