import { useState, useCallback } from "react";

export default function useParSlotMap(initialSlotCount: number) {
	const [slots, setSlots] = useState<boolean[]>(() =>
		new Array(initialSlotCount).fill(false)
	);

	const reserveSlot = useCallback((): number | null => {
		for (let i = 0; i < slots.length; i++) {
			if (!slots[i]) {
				const newSlots = [...slots];
				newSlots[i] = true;
				setSlots(newSlots);
				return i;
			}
		}
		return null;
	}, [slots]);

	const freeSlot = useCallback(
		(slotIndex: number): number | null => {
			if (slots[slotIndex]) {
				const newSlots = [...slots];
				newSlots[slotIndex] = false;
				setSlots(newSlots);
				return slotIndex;
			}
			return null;
		},
		[slots]
	);

	const getSlots = useCallback(() => [...slots], [slots]);

	return {
		reserveSlot,
		freeSlot,
		getSlots,
	};
}
