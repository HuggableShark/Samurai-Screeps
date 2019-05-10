// Test for tombstone harvesting

// Find tombstones in room with something in it
const [tombstone] = creep.room.find(FIND_TOMBSTONES, {filter: t => !!_.findKey(t.store)});
// if creep isn't working and there is a tombstones with stuff
if (tombstone != undefined && creep.memory.working == false) {
  // go to it and withdraw everything
  if (creep.withdraw(tombstone, _.findKey(tombstone.store)) == ERR_NOT_IN_RANGE) {
    creep.say('recycling');
    creep.moveTo(tombstone);
  }
}
