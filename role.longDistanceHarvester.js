// This creep goes to targeted nearby rooms to gather energy. Currently has the
//  occasional glitch of getting stuck at room boarders and jumping back and forth.

var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

module.exports = {
	// a function to run the logic for this role
	run: function(creep) {
		creep.checkWorkingStatus();

		if ((creep.ticksToLive < 200) && (creep.store[RESOURCE_ENERGY] == 0)) {
			creep.memory.working = true
			creep.memory.recycle = true
			creep.say('reuse me!');
			var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s) => (s.structureType == STRUCTURE_SPAWN)
			});
			if (creep.memory.recycle = true) {
				if (closestSpawn) {
					if (creep.pos.getRangeTo(closestSpawn) > 1) {
						creep.moveTo(closestSpawn, {
							reusePath: 50, maxOps: 500, visualizePathStyle: {} 
						});
					}
					else {
						closestSpawn.recycleCreep(creep);
					}
				}
				else {
					// find exit to home room
					var exit = creep.room.findExitTo(creep.memory.home);
					// and move to exit
					creep.moveTo(creep.pos.findClosestByRange(exit), {
						reusePath: 100, maxOps: 500, visualizePathStyle: {} 
					});
				}
			}
		}
		else {
			if (creep.memory.getDeposit) {
				harvestSiliconDeposit();
			}
			// if creep is supposed to transfer energy to a structure
			if(creep.memory.working == true) {
				delete creep.memory.targetSourceId
				// if in home room
				if (creep.room.name == creep.memory.home) {
					// find long term storage
					const storage = creep.room.storage;

					// find closest spawn, extension or tower which is not full
					let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
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
							creep.moveTo(structure, { reusePath: 25, maxOps: 500 });
						}
					}
					// if we found one
					else if (storage != undefined) {
						// try to transfer energy, if it is not in range
						if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							// move towards it
							creep.moveTo(storage, { reusePath: 100, maxOps: 500 });
						}
					}
					else {
						roleUpgrader.run(creep);
					}
				}
				// if not in home room...
				else {
					// If there is a construction site
					let buildSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
					if (buildSite != undefined && creep.room.name == creep.memory.target) {
						creep.say('building')
						roleBuilder.run(creep);
					}
					else {
						// find exit to home room
						const exit = creep.room.findExitTo(creep.memory.home);
						// and move to exit
						creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 60, maxOps: 500, visualizePathStyle: {}});
					}
				}
			}
			// if creep is supposed to harvest energy from source
			else {
				// if in target room
				if (creep.room.name == creep.memory.target) {
					// find source
					let source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
					if (!creep.memory.targetSourceId){
						creep.memory.targetSourceId = source.id
					}
					let targetSourceId = Game.getObjectById(creep.memory.targetSourceId);
					// look for time sensitive resources
					const [droppedEnergy] = creep.room.find(FIND_DROPPED_RESOURCES, {
						filter: (e) => (e.resourceType == RESOURCE_ENERGY
							&& e.amount)
					});
					// if there are either
					if (droppedEnergy != undefined) {
						// if there is some, pick it up
						if (droppedEnergy != undefined) {
							creep.say('ooh, shiny!')
							if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
								creep.moveTo(droppedEnergy, { reusePath: 50, maxOps: 500 });
							}
						}
					}

					
					// try to harvest energy, if the source is not in range
					else if (creep.harvest(targetSourceId) == ERR_NOT_IN_RANGE) {
						// move towards the source
						creep.moveTo(targetSourceId, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
					}
				}
				// if not in target room
				else {
					// find exit to target room
					const exit = creep.room.findExitTo(creep.memory.target);
					// move to exit
					creep.moveTo(creep.pos.findClosestByRange(exit), { reusePath: 60, maxOps: 500, visualizePathStyle: {} });
				}
			}
		}
	}
};

function harvestWireDeposit() {
	if (creep.memory.working == true) {
		// if in home room
		if (creep.room.name == creep.memory.home) {
			// find long term storage
			const terminal = creep.room.terminal;

			if (terminal != undefined) {
				if (creep.transfer(terminal, RESOURCE_SILICON) == ERR_NOT_IN_RANGE) {
					creep.moveTo(terminal, { reusePath: 50, maxOps: 500 });
				}
			}
		}
		// if not in home room...
		else {
			// find exit to home room
			var exit = creep.room.findExitTo(creep.memory.home);
			// and move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit), { reusePath: 60, maxOps: 500, visualizePathStyle: {} });
		}
	}

	// if creep is supposed to harvest energy from source
	else {
		// if in target room
		if (creep.room.name == creep.memory.target) {
			// find source
			var deposit = creep.room.find(FIND_DEPOSITS);
			
			if (creep.harvest(deposit) == ERR_NOT_IN_RANGE) {
				// move towards the source
				creep.moveTo(deposit, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
			}
		}
		// if not in target room
		else {
			// find exit to target room
			var exit = creep.room.findExitTo(creep.memory.target);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit), { reusePath: 60, maxOps: 500, visualizePathStyle: {} });
		}
	}
}