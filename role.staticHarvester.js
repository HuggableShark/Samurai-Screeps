// STILL IN DEVELOPMENT!
//
// Currently working to integrate into main code
//
//
//
//
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // After creep spawns and has no energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        
        // if creep is supposed to harvest energy from source
        if (creep.memory.working = false) {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
        }
    }
};