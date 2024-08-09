export class ParSlotMap {
	private slots: boolean[];
	private slotCount: number;

	constructor(slotCount: number) {
		this.slotCount = slotCount;
		this.slots = new Array(slotCount).fill(false); // Initialize all slots as free
	}

	// Reserve a free slot
	reserveSlot(): number | null {
		for (let i = 0; i < this.slotCount; i++) {
			if (!this.slots[i]) {
				// Check if the slot is free
				if (this.compareAndSet(i, false, true)) {
					// Atomically reserve the slot
					return i; // Return the index of the reserved slot
				}
			}
		}
		return null; // No free slots available
	}

	// Free a reserved slot
	freeSlot(slotIndex: number): number | null {
		if (this.compareAndSet(slotIndex, true, false)) {
			return slotIndex;
		} else {
			return null;
		}
	}

	// Atomic compare-and-set operation
	private compareAndSet(
		index: number,
		expected: boolean,
		update: boolean
	): boolean {
		if (this.slots[index] === expected) {
			this.slots[index] = update; // Update the slot status
			return true; // Operation successful
		}
		return false; // Operation failed
	}

	getSlots() {
		return this.slots;
	}
}

// Example usage
const parSlotMap = new ParSlotMap(10);
const reservedSlot = parSlotMap.reserveSlot();
if (reservedSlot !== null) {
	console.log(`Slot ${reservedSlot} reserved`);
	parSlotMap.freeSlot(reservedSlot); // Free the reserved slot
}
