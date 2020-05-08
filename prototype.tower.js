// create a new function for StructureTower
StructureTower.prototype.defend =
  function () {
    // find closest hostile creep
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // if one is found...
    if (target != undefined) {
        // ...FIRE!
        this.attack(target);
        console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! in " + this.room);
    }


    if (target == undefined && this.energy > 0) {
      //first heal any damaged creeps
      for (let name in Game.creeps) {
        // get the creep object
        var creepToHeal = Game.creeps[name];
        if (creepToHeal.hits < creepToHeal.hitsMax) {
          console.log(creepToHeal + ' is hurt in ' + this.room);
          this.heal(creepToHeal);
          console.log("Tower is healing Creeps.");
        }
        else {
          break;
        }
      }
    }


    if (target == undefined && this.energy > (this.energyCapacity * 0.75)) {
      var rampartsToFix = this.room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.hits < 100000 && s.structureType
                    == STRUCTURE_RAMPART
      });
      if (rampartsToFix.length > 0) {
          this.repair(rampartsToFix[0]);
      }
    }
  };
