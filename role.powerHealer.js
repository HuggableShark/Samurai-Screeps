// First, the spawn code for our defined body. [MOVE,MOVE,HEAL,CARRY]
// Try to find a way to pair the movement of these with their powerAttacker
// Create squadID to help assign pairs together
/*
StructureSpawn.prototype.spawnPowerHealer =
    function (energy, targetRoom, home) {
        var minNumberOfCarryParts = 1;
        var minNumberOfMoveParts = 2;
        var minNumberofHealParts = 1;
        // Body energy is 250+50+50+50=400
        var numberOfParts = Math.floor(energy / 400);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 4));
        var body = [];
        for (let i = 0; i < numberOfParts; i += 2) {
          body.push(MOVE,MOVE);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(HEAL);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(CARRY);
        }

        var nameFromRole = ('powerHealer' + targetRoom + Game.time);
        var home = this.room;

        return this.spawnCreep(body, nameFromRole, {
            memory: {
                role: 'powerHealer',
                targetRoom: targetRoom,
                home: this.room,
                powerSourceAvailable: true
            }
        });
    };
*/

module.exports = {
    run: function(creep) {
        const home = creep.memory.home;
        const targetRoom = creep.memory.targetRoom;
        const squadMate = Memory.powerSquadID
        if (squadMate != undefined) {
            creep.memory.squadMate = squadMate;
        }
        creep.memory.jobStatus = 'healing';
        const myPowerSpawns = _.filter(Game.structures, function(s) {
            return s.structureType == STRUCTURE_POWER_SPAWN});
        if (creep.memory.powerSourceAvailable == true) {
            // Once in target room, find the power bank
            if (creep.room.name == targetRoom) {
                var targetPowerBank = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (s) => (s.structureType == STRUCTURE_POWER_BANK)
                                    && (s.hits > 0)});
                creep.memory.targetPowerBank = targetPowerBank
                const allies = creep.room.find(FIND_MY_CREEPS, {
                    filter: (c) => c.hits < c.hitsMax
                });
                const damagedAllies = []
                if (creep.hits <= 200) {
                    creep.heal(creep);
                }
                if (creep.hits == creep.hitsMax) {
                    if (allies != undefined) {
                        if (creep.heal(allies[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(allies[0], {reusePath: 30});
                        }
                    }
                }
                const droppedPower = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: (p) => RESOURCE_POWER
                });
                if (allies == undefined) {
                    if (droppedPower != undefined) {
                        if (creep.pickup(droppedPower == ERR_NOT_IN_RANGE)) {
                            creep.moveTo(droppedPower);
                        }
                    }
                }
                // if power bank disappears or has nothing left to farm
                if (targetPowerBank == undefined && droppedPower == undefined) {
                    creep.memory.powerSourceAvailable = false
                }
            }
            // If not in target room, go to it
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 30});
            }
        }
        else if (creep.memory.powerSourceAvailable == false) {
            creep.say('no targ');
            if (creep.room != home) {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 30});
            }
            if (creep.room == home && creep.carry == 0) {
                creep.memory.recycle = true
                creep.say('reuse me!');
                var closestSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: (s) => (s.structureType == STRUCTURE_SPAWN)
                });
                if (creep.memory.recycle = true) {
                    if (creep.room.name == creep.memory.home) {
                        if (creep.pos.getRangeTo(closestSpawn) > 1) {
                            creep.moveTo(closestSpawn, {reusePath: 30});
                        }
                    }
                }
            }
        }
    }
};
