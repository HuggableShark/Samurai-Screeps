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

        // Attempting to identify the seperate sources in room to assign
        // static harvesters to (1 per source). Preferably have them stand on a
        // container.
        var sourcesInRoom = creep.room.find(FIND_SOURCES);
        for sourceId of sourcesInRoom {
          sourceId = 0
          sourceId++;
        }

        // if creep is supposed to harvest energy from source
        if (creep.memory.working = false) {
            // find closest source
            var closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
        }
        if (creep.memory.working = false && )
    }
};
