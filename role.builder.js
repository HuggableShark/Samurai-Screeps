var roleUpgrader = require('role.upgrader');

module.exports = {
	// a function to run the logic for this role
	run: function(creep) {
		// MANUAL: Following block is to send creep to a targeted room for build support if need be.
		// if NOT in target room
		if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
			// find exit to target room
			var exit = creep.room.findExitTo(creep.memory.target);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit), { 
				reusePath: 50, maxOps: 500, visualizePathStyle: {} 
			});
			return;
		}
		if (creep.memory.role == 'claimer') {
			creep.checkWorkingStatus()
		}

		// if creep is supposed to work on a construction site
		if (creep.memory.working == true) {
			// find a construction site
			var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
			// if we find one, go to it and build
			if(constructionSite != undefined) {
				if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
					creep.moveTo(constructionSite, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
				}
			}
			// otherwise, help upgrade
			else {
				roleUpgrader.run(creep);
			}
		}

		// if creep is supposed to harvest energy from source
		else {
			creep.getEnergy(true, true, true);
		}
	}
};
