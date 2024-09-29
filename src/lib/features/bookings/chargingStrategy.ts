export default function chargingStrategy(minutes: number) {
	const hour = 60;
	const dayInHours = 24;
	const monthInDays = 30;
	const hourlyCharge = (chargePerHour: number): number => {
		return Math.floor(minutes / hour) * chargePerHour;
	};

	const dailyCharge = (chargePerDay: number): number => {
		return Math.floor(minutes / hour / dayInHours) * chargePerDay;
	};

	const monthlyCharge = (chargePerMonth: number): number => {
		return (
			Math.floor(minutes / hour / dayInHours / monthInDays) *
			chargePerMonth
		);
	};

	const stayingCharge = (chargePerStay: number): number => {
		return chargePerStay;
	};

	return {
		hourlyCharge,
		dailyCharge,
		monthlyCharge,
		stayingCharge,
	};
}
