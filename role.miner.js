module.exports = {
  	// a function to run the logic for this role
  	run: function (creep) {
		replaceMiner(creep)
		// get source
		let source = Game.getObjectById(creep.memory.sourceId);
		// find container next to source
		if (source) {
			var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: s => s.structureType == STRUCTURE_CONTAINER
			})[0];
		}

		if (container) {
			// if creep is on top of the container
			if (creep.pos.isEqualTo(container.pos)) {
				// harvest source
				creep.harvest(source);
			}
			// if creep is not on top of the container
			else {
				// move towards it
				creep.moveTo(container, {reusePath: 25, maxOps: 500});
			}
	  	}
  	}
};

// Queues a replacement for miner creep so they spawn right when this one dies
function replaceMiner(creep) {
	if (!(creep.memory.replacementQueued == true)) {
		if (creep.ticksToLive <= ((creep.body.length * 3) - 1)) {
			creep.memory.retire = true;
		}
	}
	if (creep.memory.retire === true) {
		var assignedSource = creep.memory.sourceId;
		for (let spawn in creep.room.memory.spawns) {
			const spawnObject = Game.getObjectById(creep.room.memory.spawns[spawn])
			if (spawnObject != null) {
				var spawnName = spawnObject.name;
				if (Game.spawns[spawnName].spawning == null) {
					break;
				}

			}
		}
		creep.memory.retire = false;
		creep.memory.replacementQueued = false;
	}
	if (creep.memory.replacementQueued == false) {
		Game.spawns[spawnName].spawnMiner(assignedSource, creep.room.energyAvailable);
		creep.memory.replacementQueued = true;
	}
};
