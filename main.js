// import modules
var createCustomCreep = require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWaller = require('role.waller');
var roleAmmoMule = require('role.ammoMule');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
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
    }

//     var myRoomName = Game.spawns.Spawn1;
//
//     // function defendRoom(W7N7) {
//     // var hostiles = Game.rooms[HOME].find(FIND_HOSTILE_CREEPS);
//     // if(hostiles.length > 0) {
//     //     var username = hostiles[0].owner.username;
//     //     Game.notify(`User ${username} spotted in room ${roomName}`);
//     //     var towers = Game.rooms[HOME].find(
//     //         FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
//     //     towers.forEach(tower => tower.attack(hostiles[0]));
//     // }
//
//     //TOWER CODE
//
//     var towers = Game.rooms.W7N7.find(FIND_STRUCTURES, {filter: (s) =>
//       s.structureType == STRUCTURE_TOWER});
//     for (let tower of towers) {
//       var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
//       if (target != undefined) {
//         tower.attack(target);
//       }
//     }
//
//
//     var hostiles = Game.rooms[myRoomName].find(FIND_HOSTILE_CREEPS);
//     var towers = Game.rooms[myRoomName].find(FIND_MY_STRUCTURES, {filter:
//       {structureType: STRUCTURE_TOWER}});
//
//       //if there are hostiles - attakc them
//       if(hostiles.length > 0) {
//         var username = hostiles[0].owner.username;
//         Game.notify(`User ${username} spotted in room ${myRoomName}`);
//         towers.forEach(tower => tower.attack(hostiles[0]));
//         console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ");
//       }
//
//       //if there are no hostiles....
//       if(hostiles.length == 0) {
//         //....first heal any damaged creeps
//         for (let name in Game.creeps) {
//           // get the creep object
//           var creep = Game.creeps[name];
//           if (creep.hits < creep.hitsMax) {
//             towers.forEach(tower => tower.heal(creep));
//             console.log("Tower is healing Creeps.");
//           }
//         }
//       }
// // ############## END OF TOWER ###############################


    // setup some minimum numbers for different roles
    var minimumNumberOfHarvesters = 3;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallers = 1;
    var minimumNumberOfAmmoMules = 2;
    var minimumNumberOfLongDistanceHarvestersW7N6 = 1;
    var minimumNumberOfLongDistanceHarvestersW8N7 = 1;

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

    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createCustomCreep(
                Game.spawns.Spawn1.room.energyAvailable, 'harvester');
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
