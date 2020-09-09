module.exports = {
	// a function to run the logic for this role
	run: function(creep) {
		if (creep.memory.targetRoom != undefined && creep.room.name != creep.memory.targetRoom) {
			// find exit to target room
			let exit = creep.room.findExitTo(creep.memory.targetRoom);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit), {
				reusePath: 50, maxOps: 500, visualizePathStyle: {}
			});
		}
		// combat test
		let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		let hostileStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
			filter: { owner: { username: 'Invader' } }
		});

		if (hostile != undefined) {
			if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
				creep.moveTo(hostile);
			}
		}
		if (hostileStructure != undefined) {
			if (creep.attack(hostileStructure) == ERR_NOT_IN_RANGE) {
				creep.moveTo(hostileStructure);
			}
		}
		// end combat test

		if (hostile == undefined) {
			creep.memory.recycle = true
			let closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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
	}
};

/*
// Targeting logic
1) Squishies that could be 1-shot by towers (900 or less HP)
2) Healers, lowest HP first, focus till dead
3) Dismantlers (WORK parts), closest to the wall, focus till dead
4) Ranged Attackers
5) Melee Attackers
*/
// Create array of all hostile creeps in room 
//    (should be located in room logic to reduce redundancy)
// var hostilesInRoom = this.room.find(FIND_HOSTILE_CREEPS)
// var hostilehealers = this.room.find(FIND_HOSTILE_CREEPS, {
//   filter: function(object) {
//     return object.getActiveBodyparts(HEAL)
//   }
// })
// var squishyHostiles = _.filter(hostilesInRoom, {
//   function(h) {let (hostile in hostilesInRoom)) {
//     if
//   }}
// })