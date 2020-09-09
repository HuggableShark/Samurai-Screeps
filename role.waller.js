// This creep is responsible for building up walls and ramparts. They have their
//  own role since there is SO much energy that can be dumped into them. Uses a %
//  over time to chose how much to add.

var roleRepairer = require('role.repairer');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // Check working status
        creep.checkWorkingStatus();

        // First check if you need to be recycled
        if (creep.ticksToLive < 200 && creep.store.getUsedCapacity() == 0) {
            creep.memory.recycle = true
            creep.say('reuse me!');
            var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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
        
        else {
            if (Game.cpu.bucket >= 5000 && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 2000) {
                // if creep is supposed to repair something
                if (creep.memory.working == true) {
                    // find all walls in the room
                    if (!(creep.memory.borders)) {
                        let currentBorders = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => (s.structureType == STRUCTURE_RAMPART
                                || s.structureType == STRUCTURE_WALL)
                                && s.hits < s.hitsMax
                        });
                        creep.memory.borders = currentBorders
                    }
                    creep.memory.bordersAmount = creep.memory.borders.length
                    if (Game.time % 100) {
                        let updatedBorders = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => (s.structureType == STRUCTURE_RAMPART
                                || s.structureType == STRUCTURE_WALL)
                                && s.hits < s.hitsMax
                        });
                        if (updatedBorders.length != creep.memory.bordersAmount) {
                            creep.memory.borders = updatedBorders
                        }
                    }
                    var borders = creep.memory.borders;
                    borders = borders.sort((a, b) => a.hits - b.hits);


                    // if we find a wall that has to be repaired
                    if (borders.length > 0) {
                        // try to repair it, if not in range, go to it
                        if (creep.repair(Game.getObjectById(borders[0].id)) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(borders[0].id), { reusePath: 50, maxOps: 500 });
                        }
                    }
                    // if we can't find one
                    else {
                        // look for construction sites
                        roleRepairer.run(creep);
                    }
                }
                // if creep is supposed to harvest energy from source
                else {
                    creep.getEnergy(true, true, true);
                }
            }
            else {
                roleRepairer.run(creep);
            }
        }
    }
};


               
