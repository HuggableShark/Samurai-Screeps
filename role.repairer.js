var roleBuilder = require('role.builder');

module.exports = {
	// a function to run the logic for this role
	run: function(creep) {
		// Check working status
		creep.checkWorkingStatus();

		// First check if you need to be recycled
		if (creep.ticksToLive < 200 && creep.store.getUsedCapacity() == 0) {
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
		else{
			// Find all non-wall structures in order of HP
			if (creep.memory.working == true) {
				var structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (s) => s.hits < s.hitsMax
						&& s.structureType != STRUCTURE_WALL
						&& s.structureType != STRUCTURE_RAMPART
				});

				if (structures != undefined) {
					if (creep.repair(structures) == ERR_NOT_IN_RANGE) {
						creep.moveTo(structures, { reusePath: 20, maxOps: 500 });
					}
				}
				else {
					roleBuilder.run(creep);
				}
			}

			// if creep is supposed to harvest energy from source
			else {
				creep.getEnergy(true, true, true);
			}
		}
	}
};
