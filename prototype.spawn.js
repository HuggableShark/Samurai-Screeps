// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
	function () {
		/** @type {Room} */
		let room = this.room;
		// find all creeps in room
		/** @type {Array.<Creep>} */

		let creepsInRoom = room.find(FIND_MY_CREEPS);
		let hostile = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		const creepsMemorized = Game.roles[room.name];

		let maxEnergy = room.energyCapacityAvailable;
		let halfEnergy = room.energyCapacityAvailable / 2
		let name = undefined;

		// if no harvesters are left AND either no miners or no haulers are left
		//  spawn a backup creep
		if (_.get(creepsMemorized, 'harvester', 0) == 0 && _.get(creepsMemorized, 'miner', 0) == 0) {
			// if there are still miners or enough energy in Storage left
			if ((_.get(creepsMemorized, 'miner', 0) > 0)) {
				// create a hauler
				name = this.spawnHauler(room.energyAvailable);
			}
			// if there is no miner and not enough energy in the room left
			else {
				// create a harvester because it can work on its own
				name = this.spawnCustomCreep(room.energyAvailable, 'harvester');
			}
		}
		// if no backup creep is required
		if (maxEnergy >= 550 && room.energyAvailable >= 550) {
			// check if all sources have miners
			let sources = room.find(FIND_SOURCES);
			// iterate over all sources
			for (let source of sources) {
				// if the source has no miner
				if (!(_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id))
					&& (_.get(creepsMemorized, 'miner', 0) < this.room.memory.minCreeps['miner'])) {
					// check whether or not the source has a container
					/** @type {Array.StructureContainer} */
					let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
						filter: s => s.structureType == STRUCTURE_CONTAINER
					});
					// if there is a container next to the source
					if (containers.length > 0) {
						// spawn a miner
						name = this.spawnMiner(source.id, room.energyAvailable);
						break;
					}
				}
			}
		}

		// spawn roomGuards if there is a hostile in room
		if (hostile != undefined) {
			//###let numberOfDefenders = _.sum(creepsInRoom, (c) => c.memory.role == 'roomGuard');
			let numberOfDefenders = creepsMemorized['roomGuard']
			const preferredNumAttackParts = 5
			const beefyBoy = (130 * preferredNumAttackParts)
			if (numberOfDefenders == undefined) {
				name = this.spawnRoomGuard(room.energyAvailable);
			}
			else if (numberOfDefenders < 4) {
				name = this.spawnRoomGuard(beefyBoy);
			}
		}

		// if none of the above caused a spawn command, check for other roles
		if (name == undefined) {
			for (let role of listOfRoles) {
				// check for claim order
				if (role == 'claimer' && this.memory.claimRoom != undefined) {
					// try to spawn a claimer
					name = this.spawnClaimer(this.memory.claimRoom, maxEnergy);
					console.log(this.spawnClaimer(this.memory.claimRoom, maxEnergy))
					// if that worked
					if (name == 0) {
						// delete the claim order
						delete this.memory.claimRoom;
					}
					break;
				}
				if (role == 'roomGuard' && this.memory.attackRoom != undefined) {
					// try to spawn a guard acting as an attacker
					const preferredNumAttackParts = 5
					const beefyBoy = (130 * preferredNumAttackParts)
					name = this.spawnRoomGuard(beefyBoy, this.memory.attackRoom);
					// if that worked
					if (name == 0) {
						// delete the attack order
						delete this.memory.attackRoom;
					}
					break;
				}
				// check for targetRoom order
				if (role == 'sumo' && this.memory.targetRoom != undefined) {
					// try to spawn a claimer
					name = this.spawnSumo(this.memory.targetRoom);
					// if that worked
					if (name == 0) {
						// delete the claim order
						delete this.memory.targetRoom;
					}
					break;
				}
				// if no claim order was found, check other roles
				else if ((_.get(creepsMemorized, role, 0) < this.room.memory.minCreeps[role])){
					if (role == 'hauler') {
						name = this.spawnHauler(halfEnergy);
						continue;
					}
					if (role == 'miner' || role == 'mineralMiner') {
						continue;
					}

					else {
						name = this.spawnCustomCreep(room.energyAvailable, role)
						break;
					}
				}
			}
		}

		// spawn extractor creep if there is an extractor and terminal
		var extractor = this.room.find(FIND_STRUCTURES, {
			filter: e => e.structureType == STRUCTURE_EXTRACTOR
		});
		//###var numberOfMineralMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'mineralMiner');
		var numberOfMineralMiners = _.get(creepsMemorized, 'mineralMiner', 0)
		if (extractor != null && this.room.terminal) {
			// Change this variable once room.memory is created
			let mineralsInRoom = this.room.find(FIND_MINERALS);
			mineralInRoom = mineralsInRoom[0];
			mineralLeft = mineralInRoom.mineralAmount;
			let terminalUsed = this.room.terminal.store.getUsedCapacity();
			if ((mineralLeft > 0) && (terminalUsed < 250000)) {
				if (numberOfMineralMiners < 1) {
					name = this.spawnMineralMiner(400);
				}
			}
		}
		// if none of the above caused a spawn command check for LongDistanceHarvesters
		/** @type {Object.<string, number>} */
		let numberOfLongDistanceHarvesters = {};
		if (name == undefined) {
			// count the number of long distance harvesters globally
			for (let roomName in this.memory.minLongDistanceHarvesters) {
				numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) =>
					c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName)
				let numberOfWorkForLDH = room.controller.level;
				if (numberOfLongDistanceHarvesters[roomName] < this.memory.minLongDistanceHarvesters[roomName]) {
					name = this.spawnLongDistanceHarvester(maxEnergy, numberOfWorkForLDH, room.name, roomName, 0);
				}
			}
		}
		return name
	};

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCustomCreep =
	function (energy, roleName) {
		// create a balanced body as big as possible with the given energy
		let numberOfParts = Math.floor(energy / 200);
		// make sure the creep is not too big (no more than 21 parts for efficiency)
		numberOfParts = Math.min(numberOfParts, Math.floor(21 / 3));
		let body = [];
		for (let i = 0; i < numberOfParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(MOVE);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = (roleName + Game.time);

		// spawn creep with the created body and the given role
		return this.spawnCreep(body, nameFromRole, { memory: 
			{ role: roleName, working: false }});
	};

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnLongDistanceHarvester =
	function (energy, numberOfWorkParts, home, target, sourceIndex) {
		// create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
		let body = [];
		for (let i = 0; i < numberOfWorkParts; i++) {
			body.push(WORK);
		}

		// 150 = 100 (cost of WORK) + 50 (cost of MOVE)
		energy -= 150 * numberOfWorkParts;

		let numberOfParts = Math.floor(energy / 100);
		// make sure the creep is not too big (more than 50 parts)
		numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
		for (let i = 0; i < numberOfParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
			body.push(MOVE);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('ldh' + target + '_' + Game.time);

		// spawn creep with the created body
		return this.spawnCreep(body, nameFromRole, { memory: {
			role: 'longDistanceHarvester',
			home: home,
			target: target,
			sourceIndex: sourceIndex,
			working: false
		}});
	};

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnClaimer =
	function (target, energy) {
		let numberOfParts = Math.floor(energy / 850);
		// make sure the creep is not too big (no more than 20 parts for efficiency)
		numberOfParts = Math.min(numberOfParts, Math.floor(20 / 5));
		let body = []
		for (let i = 0; i < numberOfParts; i++) {
			body.push(CLAIM)
			body.push(MOVE)
			body.push(MOVE)
			body.push(WORK)
			body.push(CARRY)
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('claimer' + Game.time);
		return this.spawnCreep(body, nameFromRole, {memory: 
			{ role: 'claimer', target: target, working: false }});
	};

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnMiner =
	function (sourceId, energy) {
		let numberOfParts = Math.floor(energy / 550);
		// make sure the creep is not too big (no more than 12 parts for efficiency)
		numberOfParts = Math.min(numberOfParts, Math.floor(12 / 6));
		let body = [];
		for (let i = 0; i < numberOfParts; i++) {
			body.push(MOVE);
		}
		for (let i = 0; i < numberOfParts * 5; i++) {
			body.push(WORK);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('miner' + Game.time);
		return this.spawnCreep(body, nameFromRole, { memory: 
			{ role: 'miner', sourceId: sourceId }});
	};

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnHauler =
	function (energy) {
		// create a body with twice as many CARRY as MOVE parts
		let numberOfParts = Math.floor(energy / 150);
		// make sure the creep is not too big (more than 50 parts)
		numberOfParts = Math.min(numberOfParts, Math.floor(40 / 3));
		let body = [];
		for (let i = 0; i < numberOfParts * 2; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(MOVE);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('hauler' + Game.time);

		// spawn creep with the created body and the role 'hauler'
		return this.spawnCreep(body, nameFromRole, { memory: 
			{ role: 'hauler', working: false }});
	};

// create a function to spawn extractors
StructureSpawn.prototype.spawnMineralMiner =
	function (energy) {
		const body = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('mineralMiner' + Game.time);

		// create creep with the created body and the role 'hauler'
		return this.spawnCreep(body, nameFromRole, { memory: 
			{ role: 'mineralMiner', extracting: false }});
};


// create a new function to recycle creeps if they have said memory status
StructureSpawn.prototype.reuse =
	function () {
		const room = this.room;
		let creepsInRoom = room.find(FIND_MY_CREEPS);
		for (creep of creepsInRoom) {
			if (creep.memory.recycle != undefined) {
				let creepToRecycle = creep;
				this.recycleCreep(creepToRecycle);
				break;
			}
		}
	};

// roomGuard Spawn code
StructureSpawn.prototype.spawnRoomGuard =
	function (energy, targetRoom) {
		let numberOfParts = Math.floor(energy / 130);
		numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));
		let body = [];
		for (let i = 0; i < numberOfParts; i++) {
			body.push(ATTACK);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(MOVE);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('roomGuard' + Game.time);

		// create creep with the created body and the role 'hauler'
		return this.spawnCreep(body, nameFromRole, { memory: { role: 'roomGuard', 'targetRoom': targetRoom} });
	};

// roomGuard + heals spawnCode
StructureSpawn.prototype.spawnEliteRoomGuard =
	function (energy) {
		let numberOfParts = Math.floor(energy / 280);
		numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));
		let body = [];
		for (let i = 0; i < numberOfParts; i++) {
			body.push(ATTACK);
		}
		for (let i = 0; i < numberOfParts * 2; i++) {
			body.push(MOVE);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(HEAL);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('eliteRoomGuard' + Game.time);

		// spawn creep with the created body and the role 'hauler'
		return this.spawnCreep(body, nameFromRole, { memory: { role: 'eliteRoomGuard' } });
	};

// Spawns a Sumo to seige/knock down a room
StructureSpawn.prototype.spawnSumo =
	function (targetRoom) {
		// make sure the creep is not too big (more than 50 parts)
		const numberOfToughParts = 16;
		const numberOfMoveWorkParts = 6;
		const numberOfHealParts = 2;
		let body = [];
		for (let i = 0; i < numberOfToughParts; i++) {
			body.push(TOUGH);
		}
		for (let i = 0; i < numberOfMoveWorkParts; i++) {
			body.push(MOVE);
			body.push(WORK);
		}
		for (let i = 0; i < numberOfHealParts; i++) {
			body.push(HEAL);
		}
		// Name creep by their role + the current game time at spawn
		let nameFromRole = ('sumo' + Game.time);

		// spawn creep with the created body and the role 'hauler'
		return this.spawnCreep(body, nameFromRole, { memory: {role: 'sumo', targetRoom: targetRoom} });
	};

// Spawn a powerAttacker creep
StructureSpawn.prototype.spawnPowerAttacker =
	function (energy, targetRoom) {
		const minNumberOfToughParts = 1;
		const minNumberOfMoveParts = 2;
		const minNumberofAttackParts = 1;
		// Body energy is 80+10+50+50=190
		const numberOfParts = Math.floor(energy / 190);
		numberOfParts = Math.min(numberOfParts, Math.floor(50 / 4));
		let body = [];
		for (let i = 0; i < numberOfParts; i++) {
			body.push(TOUGH);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(MOVE,MOVE);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(ATTACK);
		}
		let nameFromRole = ('powerAttacker' + targetRoom + Game.time);
		const home = this.room;

		return this.spawnCreep(body, nameFromRole, {
			memory: {
				role: 'powerAttacker',
				targetRoom: targetRoom,
				home: this.room,
				powerSourceAvailable: true
			}
		});
	};

//Spawn a powerHealer !!!!Future improvements needed to pair with attacker
StructureSpawn.prototype.spawnPowerHealer =
	function (energy, targetRoom) {
		const minNumberOfCarryParts = 1;
		const minNumberOfMoveParts = 2;
		const minNumberofHealParts = 1;
		// Body energy is 250+50+50+50=400
		const numberOfParts = Math.floor(energy / 400);
		numberOfParts = Math.min(numberOfParts, Math.floor(50 / 4));
		let body = [];
		for (let i = 0; i < numberOfParts; i++) {
			body.push(MOVE,MOVE);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(HEAL);
		}
		for (let i = 0; i < numberOfParts; i++) {
			body.push(CARRY);
		}

		let nameFromRole = ('powerHealer' + targetRoom + Game.time);
		const home = this.room;

		return this.spawnCreep(body, nameFromRole, {
			memory: {
				role: 'powerHealer',
				targetRoom: targetRoom,
				home: this.room,
				powerSourceAvailable: true
			}
		});
	};
