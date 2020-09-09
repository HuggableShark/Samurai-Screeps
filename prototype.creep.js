var roles = {
	harvester: require('role.harvester'),
	upgrader: require('role.upgrader'),
	builder: require('role.builder'),
	repairer: require('role.repairer'),
	waller: require('role.waller'),
	longDistanceHarvester: require('role.longDistanceHarvester'),
	claimer: require('role.claimer'),
	miner: require('role.miner'),
	hauler: require('role.hauler'),
	mineralMiner: require('role.mineralMiner'),
	roomGuard: require('role.roomGuard'),
	sumo: require('role.sumo'),
	powerAttacker: require('role.powerAttacker'),
	powerHealer: require('role.powerHealer')
};

Creep.prototype.runRole =
	function () {
		roles[this.memory.role].run(this);
	};

Creep.prototype.checkWorkingStatus =
	function() {
		// if creep is bringing energy to a structure but has no energy left
		if (this.memory.working == true && this.store.getUsedCapacity() == 0) {
			// switch state
			this.memory.working = false;
		}
		
		// if creep is harvesting energy but is full
		else if (this.memory.working == false && this.store.getUsedCapacity() == this.store.getCapacity()) {
			// switch state
			this.memory.working = true;
		}
	};    

Creep.prototype.getEnergy =
	function (useContainer, useSource, useStorage) {	
		
		if (useStorage && this.room.storage && this.room.storage.store[RESOURCE_ENERGY] > 0) {
			const storage = this.room.storage;
			if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(storage, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
			}
		}
		
		// if the Creep should look for containers
		else if (useContainer && this.memory.targetContainer != undefined) {
			
			// Go to the target container.
			var theContainer = Game.getObjectById(this.memory.targetContainer);
			if (theContainer != undefined) {
				if (this.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.moveTo(theContainer, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
				}
				if (this.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
					this.memory.theContainer == undefined;
				}
			}
		}

		// if no container was found and the Creep should try storage, then sources
		else if (theContainer == undefined && useSource || theContainer.store.energy == 0) {
			// find closest source
			let source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

			// try to harvest energy, if the source is not in range
			if (this.harvest(source) == ERR_NOT_IN_RANGE) {

				// move towards it
				this.moveTo(source, { reusePath: 50, maxOps: 500, visualizePathStyle: {} });
			}
		}			
		
		if (theContainer == undefined) {
			let target = this.room.find( FIND_STRUCTURES, {
			filter: (s) => { return (s.structureType == STRUCTURE_CONTAINER) }});

			if (target.length > 0) {
				let allContainer = [];
				
				// Calculate the percentage of energy in each container.
				for (let item in target) {	
					allContainer.push({energyAmount: target[item].store.energy, id: target[item].id});
				}

				// Get the container containing the most energy.
				let highestContainer = _.max(allContainer, function(container){return container.energyAmount;});

				// set the target in memory so the creep dosen't
				//    change target in the middle of the room.
				if (highestContainer.energyAmount > 0) {
					this.memory.targetContainer = highestContainer.id;
				}
			}
		}
	};

				