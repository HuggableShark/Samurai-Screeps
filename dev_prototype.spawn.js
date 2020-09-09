Room.prototype.spawnQueue =
    function () {
        // Loop through room's spawns
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        let numberOfLiveCreeps = {}
        let numberOfSpawningCreeps = {}
        for (let spawn in room.memory.spawns) {
            let spawnObject = Game.getObjectById(room.memory.spawns[spawn]);
            // If there is a spawn
            if (spawnObject != null) {
                // Get it's name
                let spawnName = spawnObject.name;
                // If a creep is spawning
                if (Game.spawns[spawnName].spawning) {
                    // Get it's name
                    const creepSpawning = Game.spawns[spawnName].spawning.name;
                    // Loop through roles
                    for (let role of listOfRoles) {
                        numberOfLiveCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
                        if (creepSpawning.includes(role)) {
                            console.log("A " + role + " creep is spawning in " + spawn)
                            numberOfSpawningCreeps[role] = 
                        }
                    }
                }
            }
        }
    }

for (let creep in Game.creeps) {
    room = creep.room
    
}


// create a new function for StructureSpawn
StructureSpawn.prototype.testSpawnCreepsIfNecessary =
    function (numberOfCreeps) {
        const room = this.room
        const maxEnergy = room.energyCapacityAvailable;
        const halfEnergy = (room.energyCapacityAvailable / 2);
        let name = undefined;
        
    }