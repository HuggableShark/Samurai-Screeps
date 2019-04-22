// create a new function for StructureTower
StructureTower.prototype.defend =
  function () {
    // find closest hostile creep
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // if one is found...
    if (target != undefined) {
        // ...FIRE!
        this.attack(target);
        console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ");
    }
};

StructureTower.prototype.repair =
  function () {
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //if there are no hostiles
    if (target == undefined) {
      //first heal any damaged creeps
      for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];
        if (creep.hits < creep.hitsMax) {
          this.heal(creep);
          console.log("Tower is healing Creeps.");
        }
      }
    }
    else if (this.energy > ((this.energyCapacity / 10)* 5)){
      //Find the closest damaged Structure
      var closestDamagedStructure = towers.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType
                    != STRUCTURE_WALL
                    && s.structureType
                    != STRUCTURE_RAMPART
      });
  	  if(closestDamagedStructure) {
	     this.repair(closestDamagedStructure);
	 	   console.log("The tower is repairing buildings.");
      }
    }
};
