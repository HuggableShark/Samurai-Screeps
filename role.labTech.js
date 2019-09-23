/*
Several states that labTech will be in:
{restock, empty, doChemistry, storeBoosts}

*/


module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        var inputLab1 = creep.memory.inputLab1
        var inputLab2 = creep.memory.inputLab2
        var compoundToMake = creep.memory.labTask
        const labs = _.filter(creep.room.structures, (s) => s.structureType === STRUCTURE_LAB);
        listOfLabs = labs
        inputLabs = inputLab1 && inputLab2
        creep.memory.outputLabs = [];
        if ((creep.memory.outputLabs.length = 0) && (inputLabs)) {
            for (lab in labs) {
                if (lab.id != inputLab1 || inputLab2) {
                    outputLabs.append(lab)
                }
            }
        }
    }
};
