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
		if (creep.memory.working == true && creep.store[RESOURCE_ENERGY] == 0) {
			// switch state
			creep.memory.working = false;
		}
		// if creep is fully stocked
		if (! creep.memory.working && creep.store[RESOURCE_ENERGY] >= 50) {
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
				if (closestSpawn != null) {
                    if (creep.pos.getRangeTo(closestSpawn) > 1) {
                        creep.moveTo(closestSpawn, { reusePath: 50, maxOps: 500 });
                    }
                    else {
                        closestSpawn.recycleCreep(creep);
                    }
                }
			}
		}

		// Enter else statement for after recycle here! ##############################################################
		
		// if creep is supposed to transfer energy to a structure
		else if (creep.memory.working == true) {
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
				filter: {structureType: STRUCTURE_FACTORY}
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

			// // uncomment following to not stock factory
			// else if (factory != undefined && factory.store[RESOURCE_ENERGY] < 2500) {
			//   if (creep.transfer(factory, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			//     creep.moveTo(factory);
			//   }
			// }

			// if there isn't a structure that needs energy, deliver to storage
			else if (storage != undefined && storage.store[RESOURCE_ENERGY] < storage.storeCapacity ) {
				if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage, { reusePath: 50, maxOps: 500 });
				}
			}

			// !!!!!NEED TO FIND A BETTER WAY TO CHECK FOR JUST MINERALS!!!!

			//   var creepWithMinerals = creep.store
			//   //CODE TO DROP OFF MINERALS IN STORAGE!!!
			//   if (terminal != undefined && creep.carry.energy == 0) {
			//     creep.say('Droppin off Minerals');
			//     if (creep.transfer(terminal, _.findKey(creepWithMinerals)) == ERR_NOT_IN_RANGE) {
			//       return creep.moveTo(terminal);
			//     }
			//   }


		}
		// Otherwise, perform a pickup
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
						creep.moveTo(tombstone, { reusePath: 50, maxOps: 500 });
					}
				}
				// if there is some dropped energy, pick it up
				else if (droppedEnergy != undefined && tombstone == undefined) {
					creep.say('ooh, shiny!')
					if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
						creep.moveTo(droppedEnergy, { reusePath: 50, maxOps: 500 });
					}
					if (creep.store.getFreeCapacity() > 0 && creep.pos.getRangeTo(creep.memory.targetContainer) <= 1) {
						creep.withdraw(creep.memory.targetContainer, RESOURCE_ENERGY)
					}
				}
			}
			// if nothing time sensitive, and the creep has a target in memory
			else if (creep.memory.targetContainer) {
				// Go to the target container.
				var theContainer = Game.getObjectById(creep.memory.targetContainer);
				if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(theContainer, { reusePath: 50, maxOps: 500 });
				}
				else if (creep.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.targetContainer = undefined;
				}
			}
			// Otherwise, find a target container
			else {
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
					// set the target in memory so the creep doesn't
					// change target in the middle of the room.
					creep.memory.targetContainer = highestContainer.id;
				}
			}
		}
  	}
};
