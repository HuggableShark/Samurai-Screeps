// create a new function for StructureTower
StructureTower.prototype.defend =
	function () {
		// find closest hostile creep
		let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		// if one is found...
		if (target != undefined) {
				// ...FIRE!
				this.attack(target);
				console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! in " + this.room);
		}


		if (target == undefined) {
			//first heal any damaged creeps
			for (let name in Game.creeps) {
				// get the creep object
				let creepToHeal = Game.creeps[name];
				if (creepToHeal.hits < creepToHeal.hitsMax) {
					console.log(creepToHeal + ' is hurt in ' + this.room);
					this.heal(creepToHeal);
					console.log("Tower is healing Creeps.");
				}
				else {
					break;
				}
			}
		}


		if (target == undefined && this.energy > (this.energyCapacity * 0.6)) {
			let rampartsToFix = this.room.find(FIND_STRUCTURES, {
				filter: (s) => s.hits < 100000 && s.structureType == STRUCTURE_RAMPART
			});
			if (rampartsToFix.length > 0) {
					this.repair(rampartsToFix[0]);
			}
		}

		if (Game.cpu.bucket >=2500) {
		    if (target == undefined && this.energy > (this.energyCapacity * 0.8)) {
    			let structureToFix = Game.getObjectById(this.room.memory.structureToFix)
    			if (structureToFix != undefined) {
    			    if (structureToFix.hits < structureToFix.hitsMax * 0.85) {
        				if (this.repair(structureToFix) == 0) {
        					console.log('Repaired ' + structureToFix+ ' in ' + this.room);
        				}
    			    }
    			}
		    }
		}
	};
