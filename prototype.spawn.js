var listOfRoles = ['harvester', 'claimer', 'hauler', 'upgrader', 'repairer', 'builder', 'waller'];


// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
  function () {
    /** @type {Room} */
    let room = this.room;
    // find all creeps in room
    /** @type {Array.<Creep>} */
    let creepsInRoom = room.find(FIND_MY_CREEPS);
    let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

    /** @type {Object.<string, number>} */
    let numberOfCreeps = {};
    for (let role of listOfRoles) {
        numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
    }
    let maxEnergy = room.energyCapacityAvailable;
    let halfEnergy = room.energyCapacityAvailable / 2
    let name = undefined;

    // if there is a miner and a hauler, don't spawn harvesters
    if (numberOfCreeps['miner'] > 0 && numberOfCreeps['hauler'] > 0) {
      this.memory.minCreeps.harvester = 0;
    }
    // if there are no miner and haulers, spawn harvesters when necessary
    else if(numberOfCreeps['miner'] == 0 && numberOfCreeps['hauler'] == 0){
      this.memory.minCreeps.harvester = 2;
    }


    // if no harvesters are left AND either no miners or no haulers are left
    //  create a backup creep
    if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['hauler'] == 0) {
      // if there are still miners or enough energy in Storage left
      if (numberOfCreeps['miner'] > 0 ||
        (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150)) {
        // create a hauler
        name = this.createHauler(150);
      }
      // if there is no miner and not enough energy in Storage left
      else {
        // create a harvester because it can work on its own
        name = this.createCustomCreep(room.energyAvailable, 'harvester');
      }
    }
    // if no backup creep is required
    else if (maxEnergy >= 550) {
      // check if all sources have miners
      let sources = room.find(FIND_SOURCES);
      // iterate over all sources
      for (let source of sources) {
        // if the source has no miner
        if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
          // check whether or not the source has a container
          /** @type {Array.StructureContainer} */
          let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
          });
          // if there is a container next to the source
          if (containers.length > 0) {
            // spawn a miner
            name = this.createMiner(source.id);
            break;
          }
        }
      }
    }

    // spawn roomGuards if there is a hostile in room
    if (hostile != undefined) {
      var numberOfDefenders = _.sum(creepsInRoom, (c) => c.memory.role == 'roomGuard');
      var preferredNumAttackParts = 5
      var beefyBoy = (130 * preferredNumAttackParts)
      if (numberOfDefenders < 1) {
        name = this.spawnRoomGuard(room.energyAvailable);
      }
      else if (numberOfDefenders < 4) {
        name = this.spawnRoomGuard(beefyBoy)
      }
    }

    // if none of the above caused a spawn command check for other roles
    if (name == undefined) {
      for (let role of listOfRoles) {
        // check for claim order
        if (role == 'claimer' && this.memory.claimRoom != undefined) {
          // try to spawn a claimer
          name = this.createClaimer(this.memory.claimRoom);
          // if that worked
          if (name != undefined && _.isString(name)) {
            // delete the claim order
            delete this.memory.claimRoom;
          }
          break;
        }
        // if no claim order was found, check other roles
        else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
          if (role == 'hauler') {
            name = this.createHauler(halfEnergy);
          }
          else {
            name = this.createCustomCreep(maxEnergy, role);
            break;
          }
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

        if (numberOfLongDistanceHarvesters[roomName] < this.memory.minLongDistanceHarvesters[roomName]) {
          name = this.createLongDistanceHarvester(maxEnergy, 2, room.name, roomName, 0);
        }
      }
    }

    // print name to console if spawning was a success
    if (name != undefined && _.isString(name)) {
      console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
      for (let role of listOfRoles) {
        console.log(role + ": " + numberOfCreeps[role]);
      }
      for (let roomName in numberOfLongDistanceHarvesters) {
        console.log("LongDistanceHarvester" + roomName + ": " + numberOfLongDistanceHarvesters[roomName]);
      }
    }
  };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
  function (energy, roleName) {
    // create a balanced body as big as possible with the given energy
    var numberOfParts = Math.floor(energy / 200);
    // make sure the creep is not too big (no more than 30 parts for efficiency)
    numberOfParts = Math.min(numberOfParts, Math.floor(30 / 3));
    var body = [];
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
    var nameFromRole = (roleName + Game.time);

    // create creep with the created body and the given role
    return this.createCreep(body, nameFromRole, { role: roleName, working: false });
  };

// create a new function for StructureSpawn
StructureSpawn.prototype.createLongDistanceHarvester =
  function (energy, numberOfWorkParts, home, target, sourceIndex) {
    // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
    var body = [];
    for (let i = 0; i < numberOfWorkParts; i++) {
      body.push(WORK);
    }

    // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
    energy -= 150 * numberOfWorkParts;

    var numberOfParts = Math.floor(energy / 100);
    // make sure the creep is not too big (more than 50 parts)
    numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
    for (let i = 0; i < numberOfParts; i++) {
      body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
      body.push(MOVE);
    }
    // Name creep by their role + the current game time at spawn
    var nameFromRole = ('ldh' + target + '_' + Game.time);

    // create creep with the created body
    return this.createCreep(body, nameFromRole, {
      role: 'longDistanceHarvester',
      home: home,
      target: target,
      sourceIndex: sourceIndex,
      working: false
    });
  };

// create a new function for StructureSpawn
StructureSpawn.prototype.createClaimer =
  function (target) {
    // Name creep by their role + the current game time at spawn
    var nameFromRole = ('claimer' + Game.time);
    return this.createCreep([CLAIM, MOVE, WORK, CARRY], nameFromRole, { role: 'claimer', target: target, working: false });
  };

// create a new function for StructureSpawn
StructureSpawn.prototype.createMiner =
  function (sourceId) {
    // Name creep by their role + the current game time at spawn
    var nameFromRole = ('miner' + Game.time);
    return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], nameFromRole,
                              { role: 'miner', sourceId: sourceId });
  };

// create a new function for StructureSpawn
StructureSpawn.prototype.createHauler =
    function (energy) {
        // create a body with twice as many CARRY as MOVE parts
        var numberOfParts = Math.floor(energy / 150);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        // Name creep by their role + the current game time at spawn
        var nameFromRole = ('hauler' + Game.time);

        // create creep with the created body and the role 'hauler'
        return this.createCreep(body, nameFromRole, { role: 'hauler', working: false });
  };

// create a new function to recycle creeps if they have said memory status
StructureSpawn.prototype.reuse =
  function (spawnName) {
    let room = this.room;
    let creepsInRoom = room.find(FIND_MY_CREEPS);
    for (creep of creepsInRoom) {
      if (creep.memory.recycle != undefined) {
        var creepToRecycle = creep
        this.recycleCreep(creepToRecycle);
        break;
      }
    }
  };

// roomGuard Spawn code
StructureSpawn.prototype.spawnRoomGuard =
  function (energy) {
    var numberOfParts = Math.floor(energy / 130);
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));
    var body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(ATTACK);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }
    // Name creep by their role + the current game time at spawn
    var nameFromRole = ('roomGuard' + Game.time);

    // create creep with the created body and the role 'hauler'
    return this.spawnCreep(body, nameFromRole, { memory: { role: 'roomGuard' } });
  };

  // roomGuard + heals spawnCode
  StructureSpawn.prototype.spawnEliteRoomGuard =
    function (energy) {
      var numberOfParts = Math.floor(energy / 280);
      numberOfParts = Math.min(numberOfParts, Math.floor(50 / 2));
      var body = [];
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
      var nameFromRole = ('eliteRoomGuard' + Game.time);

      // create creep with the created body and the role 'hauler'
      return this.spawnCreep(body, nameFromRole, { memory: { role: 'eliteRoomGuard' } });
    };
