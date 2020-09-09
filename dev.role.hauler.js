module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.store[RESOURCE_ENERGY] == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is fully stocked
        if (!creep.memory.working && creep.store[RESOURCE_ENERGY] >= 50) {
            creep.memory.working = true;
            creep.memory.targetContainer = false;
        }

        if (creep.ticksToLive < 200 && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.recycle = true
            creep.say('reuse me!');
            var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN)
            });
            if (creep.memory.recycle = true) {
                if (creep.pos.getRangeTo(closestSpawn) > 1) {
                    creep.moveTo(closestSpawn, { reusePath: 50, maxOps: 500 });
                }
            }
        }

        else {
            // if creep is supposed to transfer energy to a structure
            if (creep.memory.working == true) {
                // find closest spawn, extension or tower which is not full
                const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                        || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });
                const storage = creep.room.storage;
                const terminal = creep.room.terminal;
                const factory = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_FACTORY }
                });

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure, { reusePath: 50, maxOps: 500 });
                    }
                }

                // uncomment following to not stock terminals
                else if (terminal != undefined && terminal.store[RESOURCE_ENERGY] < 2500) {
                    if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal, { reusePath: 50, maxOps: 500 });
                    }
                }

                // if there isn't a structure that needs energy, deliver to storage
                else if (storage != undefined && storage.store[RESOURCE_ENERGY] < storage.storeCapacity) {
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { reusePath: 50, maxOps: 500 });
                    }
                }
            }
            // Otherwise, perform a pickup
            else {
                // if there is dropped energy, pickup
                if (creep.memory.droppedTarget != undefined) {
                    creep.say('ooh, shiny!')
                    if (creep.pickup(creep.memory.droppedTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.memory.droppedTarget, { reusePath: 50, maxOps: 500 });
                    }
                    else if (creep.pickup(creep.memory.droppedTarget) == ERR_INVALID_TARGET) {
                        creep.memory.droppedTarget = undefined;
                    }
                }
                // Otherwise, if there is a tombstone, pickup
                else if(creep.memory.tombstoneTarget != undefined) {
                    // go to it and withdraw everything
                    let tombstone = creep.memory.tombstone
                    if (creep.withdraw(creep.memory.tombstoneTarget, _.findKey(tombstone.store)) == ERR_NOT_IN_RANGE) {
                        creep.say('recycling');
                        creep.moveTo(creep.memory.tombstoneTarget, { reusePath: 50, maxOps: 500 });
                    }
                    else if (creep.withdraw(creep.memory.tombstoneTarget, _.findKey(tombstone.store)) == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.tombstoneTarget = undefined;
                    }
                }
                // Otherwise, pickup from a container
                else if (creep.memory.containerTarget != undefined){
                    // Go to the target container.
                    var theContainer = Game.getObjectById(creep.memory.targetContainer);
                    if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(theContainer, { reusePath: 50, maxOps: 500 });
                    }
                    else if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.containerTarget = undefined;
                    }
                }
                // If no targets in memory, search for new/better ones
                else{
                    haulerFindEnergy(creep);
                }
            }
        }
    }
};

/*
memory will be creep.memory.pickupFrom =
				creep.memory
1) look for dropped energy
2) look for tombstones
3) grab from containers

4) No energy to grab, get stuff from storage and fill things if they need them.
*/

function haulerFindEnergy(creep) {
    const room = creep.room;
    // Find the container with the most energy.
    const [allContainers] = room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });
    // look for dropped energy
    const [droppedEnergy] = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (e) => (e.resourceType == RESOURCE_ENERGY
            && e.amount)
    });
    // look for tombstones
    const [tombstone] = creep.room.find(FIND_TOMBSTONES, { filter: t => !!_.findKey(t.store) });

    // Get highest value first
    const containerTarget = _.max(allContainers, 'store[RESOURCE_ENERGY]');
    const droppedTarget = _.max(droppedEnergy, 'amount');
    const tombstoneTarget = tombstone[0];

    if (containerTarget) {
        console.log('container ' + containerTarget + ' in ' + creep.room.name);
        creep.memory.containerTarget = containerTarget;
    }
    if (droppedTarget) {
        console.log('dropped ' + droppedTarget + ' in ' + creep.room.name);
        creep.memory.droppedTarget = droppedTarget;
    }
    if (tombstoneTarget) {
        console.log('tomb ' + tombstoneTarget + ' in ' + creep.room.name);
        creep.memory.tombstoneTarget = tombstoneTarget;
    }
}