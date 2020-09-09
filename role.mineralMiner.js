module.exports = {
    /** @param{Creep} creep **/
    run:function(creep) {
        
        // Move rest of code into else statement to dump excess minerals out of terminals again
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
            if (creep.memory.extracting && creep.carryCapacity == _.sum(creep.carry)) {
                creep.memory.extracting = false;
            }
            if (!creep.memory.extracting && 0 == _.sum(creep.carry)) {
                creep.memory.extracting = true;
            }
            if (creep.memory.extracting) {
                var target;
                if (creep.memory.depositId) {
                    target = Game.getObjectById(creep.memory.depositId);
                }
                else {
                    var targets = creep.room.find(FIND_MINERALS);
                    target = targets[0];
                    creep.memory.depositId = target.id;
                    creep.memory.mineralType = target.mineralType;
                }
                if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 100});
                }
            }
            else {
                if (creep.room.terminal) {
                    if (creep.transfer(creep.room.terminal, creep.memory.mineralType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.terminal, {reusePath: 100});
                    }
                }
                else if (creep.room.storage) {
                    if (creep.transfer(creep.room.storage, creep.memory.mineralType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {reusePath: 100});
                    }
                }
            }
        }
    }
}
