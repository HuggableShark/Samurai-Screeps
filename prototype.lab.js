StructureLab.prototype.createZK =
    function(inputLab1, inputLab2) {

        return runReaction;
}
StructureLab.prototype.createUL =
    function(inputLab1, inputLab2) {
        creep.memory.restockLab1With = 'L'
        creep.memory.restockLab2With = 'U'
        //First, check for input labs contents
        var inputLab1MineralType = inputLab1.mineralType;
        var inputLab2MineralType = inputLab2.mineralType;
        // Check inputLab1 contents
        if (inputLab1MineralType != RESOURCE_LEMERGIUM) {
            // If there is NON L in the lab
            if (inputLab1.mineralAmount > 0) {
                creep.memory.emptyingLab = 1
                if (creep.withdraw(inputLab1, RESOURCES_ALL) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(inputLab1, {reusePath: 30});
                }
            }
            // If there is nothing in the lab
            else if (inputLab1.mineralAmount === 0) {
                creep.memory.emptyingLab = 0;
            }
        }
        else if (inputLab2MineralType != RESOURCE_UTRIUM) {
            // If there is NON U in the lab
            if (inputLab2.mineralAmount > 0) {
                creep.memory.emptyingLab = 2
                if (creep.withdraw(inputLab2, RESOURCES_ALL) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(inputLab2, {reusePath: 30});
                }
            }
            // If there is nothing in the lab
            else if (inputLab2.mineralAmount === 0) {
                creep.memory.emptyingLab = 0;
            }
        }
        // Otherwise, if both input labs are full of the proper minerals and energy
        else {
            if ((inputLab1.mineralAmount == inputLab1.mineralCapacity)
                && (inputLab2.mineralAmount == inputLab2.mineralCapacity)
                && (inputLab1.energy == inputLab1.energyCapacity)
                && (inputLab2.energy == inputLab2.energyCapacity)
            ){
                //then run the reaction
                return runReaction(inputLab1, inputLab2);
            }
        }
}
