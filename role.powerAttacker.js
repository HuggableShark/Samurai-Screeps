// First the spawn code with our defined body.[TOUGH,MOVE,MOVE,ATTACK]
// Should place all toughs, then all moves, then all attacks
// Must know energy available for spawn, target room, and room to return to
// Need to create spawnIDs to help associate pairs

/*
StructureSpawn.prototype.spawnPowerAttacker =
    function (energy, targetRoom, home) {
        var minNumberOfToughParts = 1;
        var minNumberOfMoveParts = 2;
        var minNumberofAttackParts = 1;
        // Body energy is 80+10+50+50=190
        var numberOfParts = Math.floor(energy / 190);
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 4));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
          body.push(TOUGH);
        }
        for (let i = 0; i < numberOfParts; i += 2) {
          body.push(MOVE,MOVE);
        }
        for (let i = 0; i < numberOfParts; i++) {
          body.push(ATTACK);
        }
        var nameFromRole = ('powerAttacker' + targetRoom + Game.time);
        var home = this.room;

        return this.spawnCreep(body, nameFromRole, {
            memory: {
                role: 'powerAttacker',
                targetRoom: targetRoom,
                home: this.room,
                powerSourceAvailable: TRUE
            }
        });
    };
*/
module.exports = {
    run: function(creep) {
        const home = creep.memory.home;
        const targetRoom = creep.memory.targetRoom;
        const squadMate = Memory.powerSquadID;
        if (creep.hits <= 200) {
            creep.memory.combatStatus = 'recovering';
        }
        if (creep.hits == creep.hitsMax) {
            creep.memory.combatStatus = 'attacking';
        }
        // While creep is going to the targeted power bank
        if (creep.memory.powerSourceAvailable == true) {
            // Once in target room, find the power bank
            if (creep.room.name == targetRoom) {
                var targetPowerBank = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (s) => (s.structureType == STRUCTURE_POWER_BANK)
                                    && (s.hits > 0)});
                // If there's a powerbank, then move to and attack it
                if (targetPowerBank != undefined) {
                    creep.attackPowerBank(targetPowerBank);
                }
                // if power bank disappears or has nothing left to farm
                if (targetPowerBank == undefined) {
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
        if (creep.memory.powerSourceAvailable == false) {
            creep.say('no targ');
            if (creep.room != home) {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 30});
            }
            if (creep.room == home) {
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

Creep.prototype.attackPowerBank =
    function (targetPowerBank) {
        const combatStatus = this.memory.combatStatus
        switch(this.memory.combatStatus) {
            case 'attacking':
                if (this.attack(targetPowerBank) == ERR_NOT_IN_RANGE) {
                    this.moveTo(targetPowerBank, {reusePath: 30});
                }
                break;
            case 'recovering':
                this.say('Need Healing!');
                break;
            // default:
            //     console.log('~');
            //     creep.say('~');
        };
    }
