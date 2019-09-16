var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    waller: require('role.waller'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    claimer: require('role.claimer'),
    miner: require('role.miner'),
    hauler: require('role.hauler'),
    mineralMiner: require('role.mineralMiner'),
    roomGuard: require('role.roomGuard'),
    sumo: require('role.sumo')
};

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    };


Creep.prototype.getEnergy =
    function (useContainer, useSource) {
        // if the Creep should look for containers
        if (useContainer) {
          // Go to the target container.
          var theContainer = Game.getObjectById(this.memory.targetContainer);
          if (this.withdraw(theContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(theContainer);
          }
        }
        // if no container was found and the Creep should look for Sources
        if (theContainer == undefined && useSource || theContainer.store.energy == 0) {
            // find closest source
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            // try to harvest energy, if the source is not in range
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(source);
            }
        }
        var target = this.room.find( FIND_STRUCTURES, {
          filter: (s) => {
            return (s.structureType == STRUCTURE_CONTAINER);
          }
        });

        if (target.length > 0) {
          var allContainer = [];
          // Calculate the percentage of energy in each container.
          for (var i = 0; i < target.length; i++) {
            allContainer.push({energyPercent:((target[i].store.energy / target[i].storeCapacity) * 100), id:target[i].id});
          }

          // Get the container containing the most energy.
          var highestContainer = _.max(allContainer, function(container){return container.energyPercent;});
          // set the target in memory so the creep dosen't
          // change target in the middle of the room.
          this.memory.targetContainer = highestContainer.id;
        }
};
