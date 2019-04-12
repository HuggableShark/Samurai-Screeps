// Haulers grab energy from nearby sources and transports to spawns/extentions.
// May incorporate more side jobs for them later.

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is bringing energy to a structure but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is fully stocked
    if (! creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.memory.targetContainer = false;
    }

    // if creep is supposed to transfer energy to a structure
    if (creep.memory.working == true) {
      // find closest spawn, extension or tower which is not full
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                     || s.structureType == STRUCTURE_EXTENSION
                     || s.structureType == STRUCTURE_TOWER)
                     && s.energy < s.energyCapacity
      });

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(structure);
        }
      }
    }
    // Otherwise, stock up
    else {
      // If the creep have a target.
      if (creep.memory.targetContainer) {
        // Go to the container.
        var theContainer = Game.getObjectById(creep.memory.targetContainer);
        if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(theContainer);
        }
      }
        else {
          // Find the container with the most energy.
          var target = creep.room.find( FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER);
            }
          });

          if (target.length) {
            var allContainer = [];
            // Calculate the percentage of energy in each container.
            for (var i = 0; i < target.length; i++) {
              allContainer.push({energyPercent:((target[i].store.energy / target[i].storeCapacity) * 100), id:target[i].id});
            }

            // Get the container containing the most energy.
            var highestContainer = _.max(allContainer, function(container){return container.energyPercent;});
            console.log('Going for the container id "' + highestContainer.id + '" at ' + highestContainer.energyPercent + '% full.');
            // set the target in memory so the creep dosen't
            // change target in the middle of the room.
            creep.memory.targetContainer = highestContainer.id;
          }
        }
      /*
      var containersInRoom = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_CONTAINER)
              && (s.store[RESOURCE_ENERGY] > 0);
        }
      });
      var targetContainer = creep.pos.findClosestByPath(containersInRoom);
      if (targetContainer) {
        if (creep.withdraw(targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targetContainer);
        }
      }
      */
    }
  }
};
