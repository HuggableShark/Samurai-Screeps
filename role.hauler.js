// Haulers grab energy from nearby sources and transports to spawns/extentions.
//  Will bring to towers if others are full, and to storage if all else if full.
//  Will also act as cleanup crew on tombstones and will stock terminals.
//
//
// May incorporate more side jobs for them later.
//#############################################################################

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is bringing energy to a structure but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is fully stocked
    if (! creep.memory.working && creep.carry.energy >= 50 || creep.store) {
      creep.memory.working = true;
      creep.memory.targetContainer = false;
    }

    if (creep.ticksToLive < 200 && creep.carry.energy == 0) {
      creep.memory.recycle = true
      creep.say('reuse me!');
      var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN)
      });
      if (creep.memory.recycle = true) {
        if (creep.pos.getRangeTo(closestSpawn) > 1) {
        creep.moveTo(closestSpawn);
        }
      }
    }


    // if creep is supposed to transfer energy to a structure
    else if (creep.memory.working == true) {
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
      var storage = creep.room.storage
      var terminal = creep.room.terminal

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(structure);
        }
      }

      // uncomment following to not stock terminals
      else if (terminal != undefined && terminal.store[RESOURCE_ENERGY] < 2000) {
        if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(terminal);
        }
      }

      // if there isn't a structure that needs energy, deliver to storage
      else if (storage != undefined && storage.store[RESOURCE_ENERGY] < storage.storeCapacity ) {
        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
        }
      }
      /*
      var terminal = creep.room.terminal
      var creepWithMinerals = creep.carry
      // CODE TO DROP OFF MINERALS IN TERMINAL!!!
      if (terminal != undefined && creep.carry.energy == 0) {
        if (creep.transfer(terminal, _.findKey(creep.carry)) == ERR_NOT_IN_RANGE) {
          creep.moveTo(terminal);
        }
      }
      */
    }
    // Otherwise, pick-up from a container
    else {
      // look for time sensitive resources
      const [droppedEnergy] = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (e) => (e.resourceType == RESOURCE_ENERGY
                     && e.amount)
      });
      const [tombstone] = creep.room.find(FIND_TOMBSTONES, {filter: t => !!_.findKey(t.store)});

      // if there are either
      if (droppedEnergy != undefined || tombstone != undefined) {
        // if creep isn't working and there is a tombstones with stuff
        if (tombstone != undefined) {
          // go to it and withdraw everything
          if (creep.withdraw(tombstone, _.findKey(tombstone.store)) == ERR_NOT_IN_RANGE) {
            creep.say('recycling');
            creep.moveTo(tombstone);
          }
        }
        // if there is some, pick it up
        else if (droppedEnergy != undefined) {
          creep.say('ooh, shiny!')
          if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy);
          }
        }
      }
      // If the creep have a target in memory
      else if (creep.memory.targetContainer) {
        // Go to the target container.
        var theContainer = Game.getObjectById(creep.memory.targetContainer);
        if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(theContainer);
        }
        else if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
          creep.memory.targetContainer = undefined;
        }
      }
      else {
        // look for time sensitive resources
        const [droppedEnergy] = creep.room.find(FIND_DROPPED_RESOURCES, {
          filter: (e) => (e.resourceType == RESOURCE_ENERGY
                       && e.amount)
        });
        const [tombstone] = creep.room.find(FIND_TOMBSTONES, {filter: t => !!_.findKey(t.store)});

        // if there are either
        if (droppedEnergy != undefined || tombstone != undefined) {
          // if creep isn't working and there is a tombstones with stuff
          if (tombstone != undefined) {
            // go to it and withdraw everything
            if (creep.withdraw(tombstone, _.findKey(tombstone.store)) == ERR_NOT_IN_RANGE) {
              creep.say('recycling');
              creep.moveTo(tombstone);
            }
          }
          // if there is some, pick it up
          else if (droppedEnergy != undefined) {
            creep.say('ooh, shiny!')
            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
              creep.moveTo(droppedEnergy);
            }
          }
        }
        // Find the container with the most energy.
        var target = creep.room.find( FIND_STRUCTURES, {
          filter: (s) => {
            return (s.structureType == STRUCTURE_CONTAINER);
          }
        });

        if (target.length > 0) {
          var allContainer = [];
          // Calculate the percentage of energy in each container.
          for (var i = 0; i < target.length; i++) {
            allContainer.push({energyPercent:((target[i].store.energy / target[i].storeCapacity) * 100), id:target[i].id});
          }

          // Get the container containing the most energy.
          var highestContainer = _.max(allContainer, function(container){return container.energyPercent;});
          // set the target in memory so the creep dosen't
          // change target in the middle of the room.
          creep.memory.targetContainer = highestContainer.id;
        }
      }
    }
  }
};
