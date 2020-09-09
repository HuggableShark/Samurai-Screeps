// This creep's primary focus is to upgrade the room controller.

module.exports = {
	// a function to run the logic for this role
	run: function(creep) {
		// Check working status
		creep.checkWorkingStatus();

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
		else {
			// if creep is supposed to transfer energy to the controller
			if (creep.memory.working == true) {
				// instead of upgraderController we could also use:
				// if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

				// try to upgrade the controller
				if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					// if not in range, move towards the controller
					creep.moveTo(creep.room.controller, { reusePath: 10, maxOps: 500 });
				}
			}
			// If creep needs energy
			else {
				creep.getEnergy(true, true, true);
			}
		}
	}
};
