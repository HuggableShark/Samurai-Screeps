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

    /*
    else if (target == undefined) {
      //first heal any damaged creeps
      for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];
        if (creep.hits < creep.hitsMax) {
          this.heal(creep);
          console.log("Tower is healing Creeps.");
        }
        else {
          break;
        }
      }
    }
    */

    else if(target == undefined && this.energy > (this.energyCapacity * 0.5)) {
      var rampartsToFix = this.room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.hits < 10000 && s.structureType
                    == STRUCTURE_RAMPART
      });
      this.repair(rampartsToFix[0]);

    }
};
