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
        else if (creep.memory.role == 'longDistanceHarvester') {
          roleLongDistanceHarvester.run(creep);
        }
        // CONTAINER HARVESTER CODE
        //###
        // if creep is miner, call miner script
        else if (creep.memory.role == 'miner') {
          roleMiner.run(creep);
        }
        // if creep is hauler, call hauler script
        else if (creep.memory.role == 'hauler') {
          roleHauler.run(creep);
        }
        //###
    }

    // run tower code
    var myRoomsHash = Game.rooms;
    for(var roomName in myRoomsHash) {
      var thisRoom = myRoomsHash[roomName];
      var roomTowers = thisRoom.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_TOWER
                                         && (structure.energy > 9)
        }
      })
        for (var towerIterator = 0; towerIterator < roomTowers.length; towerIterator++) {
          var thisTower = roomTowers[towerIterator];
          tower.activate(thisTower);
      }
    }

    var myRoomName = Game.roomName;
    var HOME = 'W7N7';

    // iterate over all the spawns
    for (let spawnName in Game.spawns) {
      let spawn = Game.spawns[spawnName];
      let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);

      // setup some minimum numbers for different roles
      var minimumNumberOfHarvesters = 1;
      var minimumNumberOfUpgraders = 1;
      var minimumNumberOfBuilders = 1;
      var minimumNumberOfRepairers = 1;
      var minimumNumberOfWallers = 1;
      var minimumNumberOfAmmoMules = 1;
      var minimumNumberOfLongDistanceHarvestersW7N6 = 2;
      var minimumNumberOfLongDistanceHarvestersW8N7 = 2;
      var minimumNumberOfMiners = 2;
      var minimumNumberOfHaulers = 2;


      // count the number of creeps alive for each role
      // _.sum will count the number of properties in Game.creeps filtered by the
      //  arrow function, which checks for the creep being a specific role
      var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
      var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
      var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
      var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
      var numberOfWallers = _.sum(Game.creeps, (c) => c.memory.role == 'waller');
      var numberOfAmmoMules = _.sum(Game.creeps, (c) => c.memory.role == 'ammoMule');
      var numberOfLongDistanceHarvestersW7N6 = _.sum(Game.creeps, (c) =>
        c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W7N6');
      var numberOfLongDistanceHarvestersW8N7 = _.sum(Game.creeps, (c) =>
        c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W8N7');
      var numberOfTowers = Game.rooms.W7N7.find(
        FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
      var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
      var numberOfHaulers = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');


      var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
      var name = undefined;

      // if not enough harvesters
      if (numberOfHarvesters < minimumNumberOfHarvesters && numberOfMiners == 0) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
          // spawn one with what is available
          name = Game.spawns.Spawn1.createCustomCreep(
            Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
      }
      else if (numberOfMiners < minimumNumberOfMiners) {
        // list sources in room
        let sources = spawn.room.find(FIND_SOURCES);
        // iterate over all sources
        for (let source of sources) {
          // if the source has no miner
          if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
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
      else if (numberOfHaulers < minimumNumberOfHaulers) {
          // try to spawn one
          name = Game.spawns.Spawn1.createHauler(energy, 'hauler');
          if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHaulers == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createHauler(
              Game.spawns.Spawn1.room.energyAvailable, 'hauler');
          }
      }
      // if not enough upgraders
      else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
      }
      // if not enough repairers
      else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
      }
      // if not enough builders
      else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
      }
      // if not enough wallers
      else if (numberOfWallers < minimumNumberOfWallers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'waller');
      }
      // if not enough ammoMules
      else if (numberOfAmmoMules < minimumNumberOfAmmoMules) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'ammoMule');
      }
      // if not enough longDistanceHarvesters for W7N4
      else if (numberOfLongDistanceHarvestersW7N6 < minimumNumberOfLongDistanceHarvestersW7N6) {
        // try to spawn one
        name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W7N6', 0, 'longDistanceHarvesterW7N6');
      }
      // if not enough longDistanceHarvesters for W6N3
      else if (numberOfLongDistanceHarvestersW8N7 < minimumNumberOfLongDistanceHarvestersW8N7) {
        // try to spawn one
        name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W8N7', 0, 'longDistanceHarvesterW8N7');
      }
      // print name to console if spawning was a success
      // name > 0 would not work since string > 0 returns false
      if (!(name < 0)) {
        console.log("Spawned new creep: " + name)
      };
    };
};
