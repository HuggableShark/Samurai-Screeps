module.exports = function() {
  // create a new function for StructureSpawn
  StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName) {
      // create a balanced body as big as possible with half of the total energy
      var numberOfParts = Math.floor(energy / 200);
      var body = [];
      for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }

      // Name creep by their role + the current game time at spawn
      var nameFromRole = (roleName + Game.time);

      // create creep with the created body and the given role
      return this.createCreep(body, nameFromRole, {
        role: roleName,
        working: false
      });
    };

  // create a new function for StructureSpawn
  StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex, rolename) {
      // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
      var body = [];
      for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
      }

      // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
      energy -= 150 * numberOfWorkParts;

      var numberOfParts = Math.floor(energy / 100);
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
        body.push(MOVE);
      }

      // create creep with the created body
      return this.createCreep(body, 'longDistanceHarvester', {
        role: 'longDistanceHarvester',
        home: home,
        target: target,
        sourceIndex: sourceIndex,
        working: false
      });
    };

  // Miner spawn code: 5x WORK, 1 CARRY, 1 MOVE parts
  StructureSpawn.prototype.createMiner =
    function (sourceId) {
      var body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
      var nameFromRole = ('miner' + Game.time);
      return this.createCreep(body, nameFromRole, {
        role: 'miner',
        sourceId: sourceId
      });
    }

  // hauler spawn code of equal CARRY and MOVE parts
  StructureSpawn.prototype.createHauler =
    function(energy, roleName) {
      // create a balanced body as big as possible with the given energy
      var numberOfParts = Math.floor(energy / 200);
      var body = [];
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }

        // Name creep by their role + the current game time at spawn
        var nameFromRole = (roleName + Game.time);

        // create creep with the created body and the given role
        return this.createCreep(body, nameFromRole, {
          role: roleName,
          working: false
        });
    };

  // create funtion to spawn a claimer
  StructureSpawn.prototype.createClaimer =
    function (target) {
      return this.createCreep([CLAIM, MOVE], 'claimer', {
        role: 'claimer',
        target: target
      });
    }
};
