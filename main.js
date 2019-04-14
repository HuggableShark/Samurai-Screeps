// import modules
var createCustomCreep = require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWaller = require('role.waller');
var roleAmmoMule = require('role.ammoMule');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var tower = require('role.tower');
var roleMiner = require('role.miner')
var roleHauler = require('role.hauler');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {
  // check for memory entries of dead creeps by iterating over Memory.creeps
  for (let name in Memory.creeps) {
    // and checking if the creep is still alive
    if (!Game.creeps[name]) {
      // if not, delete the memory entry
      delete Memory.creeps[name];
    }
  }

  // for every creep name in Game.creeps
  for (let name in Game.creeps) {
    // get the creep object
    var creep = Game.creeps[name];

    // if creep is harvester, call harvester script
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    // if creep is upgrader, call upgrader script
    else if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    // if creep is builder, call builder script
    else if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    // if creep is repairer, call repairer script
    else if (creep.memory.role == 'repairer') {
      roleRepairer.run(creep);
    }
    // if creep is wallRepairer, call wallRepairer script
    else if (creep.memory.role == 'waller') {
      roleWaller.run(creep);
    }
    // If ammoMule, do ammoMule things
    if(creep.memory.role == 'ammoMule') {
      roleAmmoMule.run(creep);
    }
    // if creep is longDistanceHarvester, call longDistanceHarvester script
    if (creep.memory.role == 'longDistanceHarvester') {
      roleLongDistanceHarvester.run(creep);
    }
    // if creep is miner, call miner script
    if (creep.memory.role == 'miner') {
      roleMiner.run(creep);
    }
    // if creep is hauler, call hauler script
    if (creep.memory.role == 'hauler') {
      roleHauler.run(creep);
    }
    // if creep is a claimer, run claimer script
    if (creep.memory.role == 'claimer') {
      roleClaimer.run(creep)
    }
  }

  // TOWER CODE
  // for all rooms in game, check for towers I own
  var myRoomsHash = Game.rooms;
  for(var roomName in myRoomsHash) {
    var thisRoom = myRoomsHash[roomName];
    var roomTowers = thisRoom.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_TOWER
                                       && (structure.energy > 9)
      }
    })
    // for each tower, activate tower script
    for (var towerIterator = 0; towerIterator < roomTowers.length; towerIterator++) {
      var thisTower = roomTowers[towerIterator];
      tower.activate(thisTower);
    }
  }

  var HOME = 'W7N7';
  // iterate over all the spawns
  for (let spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName];
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);


    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a specific role
    var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
    var numberOfWallers = _.sum(creepsInRoom, (c) => c.memory.role == 'waller');
    var numberOfAmmoMules = _.sum(creepsInRoom, (c) => c.memory.role == 'ammoMule');
    var numberOfLongDistanceHarvestersW7N6 = _.sum(Game.creeps, (c) =>
      c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W7N6');
    var numberOfLongDistanceHarvestersW8N7 = _.sum(Game.creeps, (c) =>
      c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W8N7');
    var numberOfTowers = Game.rooms.W7N7.find(
      FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    var numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
    var numberOfHaulers = _.sum(creepsInRoom, (c) => c.memory.role == 'hauler');

    // variable for all energy possible in the room
    var energy = spawn.room.energyCapacityAvailable;
    // variable for half of the possible energy in room, allows for easier and
    //    more efficient creep creation
    var halfEnergy = ((spawn.room.energyCapacityAvailable) / 2);
    var name = undefined;


    // if not enough harvesters
    if (numberOfHarvesters < spawn.memory.minHarvesters && numberOfMiners == 0) {
      // try to spawn one
      name = spawn.createCustomCreep(energy, 'harvester');

      // if spawning failed and we have no harvesters left
      if (numberOfHarvesters < spawn.memory.minHarvesters && name == ERR_NOT_ENOUGH_ENERGY && numberOfMiners == 0) {
        // spawn one with what is available
        name = spawn.createCustomCreep(
          spawn.room.energyAvailable, 'harvester');
      }
    }
    // spawn a claimer if a room has been targeted in spawn's memory
    else if (spawn.memory.claimRoom != undefined) {
      name = spawn.createClaimer(spawn.memory.claimRoom);
      // delete memory entry after spawning
      if (!(name < 0)) {
        delete spawn.memory.claimRoom;
      }
    }
    // if not enough miners
    else if (numberOfMiners < spawn.memory.minMiners) {
      // list sources in room
      let sources = spawn.room.find(FIND_SOURCES);
      // iterate over all sources
      for (let source of sources) {
        // if the source has no miner
        if (!_.some(Game.creeps, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
          // check whether or not the source has a container
          let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
          });
          // if there is a container next to the source
          if (containers.length > 0) {
            // spawn a miner
            name = spawn.createMiner(source.id);
            break;
          }
        }
      }
    }
    // if not enough haulers
    else if (numberOfHaulers < spawn.memory.minHaulers) {
      // try to spawn one
      name = spawn.createHauler(energy, 'hauler');
      if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHaulers == 0) {
        // spawn one with what is available
        name = spawn.createHauler(
          spawn.room.energyAvailable, 'hauler');
      }
    }
    // if not enough upgraders
    else if (numberOfUpgraders < spawn.memory.minUpgraders) {
      // try to spawn one
      name = spawn.createCustomCreep(halfEnergy, 'upgrader');
    }
    // if not enough repairers
    else if (numberOfRepairers < spawn.memory.minRepairers) {
      // try to spawn one
      name = spawn.createCustomCreep(halfEnergy, 'repairer');
    }
    // if not enough builders
    else if (numberOfBuilders < spawn.memory.minBuilders) {
      // try to spawn one
      name = spawn.createCustomCreep(halfEnergy, 'builder');
    }
    // if not enough wallers
    else if (numberOfWallers < spawn.memory.minWallers) {
      // try to spawn one
      name = spawn.createCustomCreep(halfEnergy, 'waller');
    }
    // if not enough ammoMules
    else if (numberOfAmmoMules < spawn.memory.minAmmoMules) {
      // try to spawn one
      name = spawn.createCustomCreep(halfEnergy, 'ammoMule');
    }
    // if not enough longDistanceHarvesters for W7N6
    else if (numberOfLongDistanceHarvestersW7N6 < spawn.memory.minLDHW7N6) {
      // try to spawn one
      name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W7N6', 0, 'longDistanceHarvesterW7N6');
    }
    /*
    // COMMENTED OUT SINCE WE CLAIMED THIS ROOM, UNCOMMENT TO HARVEST FROM AN EXTRA ROOM
    // if not enough longDistanceHarvesters for W8N7
    else if (numberOfLongDistanceHarvestersW8N7 < minimumNumberOfLongDistanceHarvestersW8N7) {
      // try to spawn one
      name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W8N7', 0, 'longDistanceHarvesterW8N7');
    }
    */

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && name != undefined) {
      console.log(spawnName + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
      console.log("Harvesters     : " + numberOfHarvesters);
      console.log("Miners         : " + numberOfMiners);
      console.log("Haulers        : " + numberOfHaulers);
      console.log("Upgraders      : " + numberOfUpgraders);
      console.log("Builders       : " + numberOfBuilders);
      console.log("Repairers      : " + numberOfRepairers);
      console.log("Wallers        : " + numberOfWallers);
    }
  };
};
