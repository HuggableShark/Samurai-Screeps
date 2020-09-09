var roleBuilder = require('role.builder');

module.exports = {
	// a function to run the logic for this role
	run: function(creep) {
		let targetRoom = creep.memory.target
		// if NOT in target room
		if (creep.room.name != creep.memory.target) {
			// find exit to target room
			var exit = creep.room.findExitTo(creep.memory.target);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit), { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
			//creep.moveTo(Game.rooms[targetRoom].controller, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
		}
		else {
			if (creep.room.controller.reservation != undefined) {

				if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					console.log(creep.room.controller)
					// move to controller
					creep.moveTo(creep.room.controller, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
					console.log(creep.moveTo(creep.room.controller, { reusePath: 50, maxOps: 500, visualizePathStyle: {} }))
				}
			}

			else if (creep.room.controller.my == false) {

				// try to claim controller
				if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					// move to controller
					creep.moveTo(creep.room.controller, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
				}

				
				if (creep.claimController(creep.room.controller == ERR_GCL_NOT_ENOUGH)) {
					if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
					}
				}
			}

			// once claimed, help build
			else {
				if (Game.time % 5 == 0) {
					creep.say('building');
				}
				roleBuilder.run(creep);
			}
		}
	}
};
