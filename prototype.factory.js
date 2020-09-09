// Create commonidity bars based off of mineral resource gathered in room.

function getCommodiumType () {
    const roomName = this.room
    const mineralId = Game.rooms[roomName].memory.resourcesProduced.mineralId
    const mineralType = Game.getObjectById(mineralId).mineralType

    return {
        let commodityToMake = 
    }
}