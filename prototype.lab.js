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
                creep.memory.emptyingLab = TRUE
                if (creep.withdraw(inputLab1, RESOURCES_ALL) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(inputLab1);
                }
            }
            // If there is nothing in the lab
            else if (inputLab1.mineralAmount == 0) {
                creep.memory.emptyingLab = FALSE;

            }
        }
        return runReaction;
    }
