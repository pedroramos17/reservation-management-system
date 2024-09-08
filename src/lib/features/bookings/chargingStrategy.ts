export default function chargingStrategy(minutes: number) {
	const halfHour = 30;
	const hour = 60;
	const dayInHours = 24;
	const monthInDays = 30;
	const lessThanTenMinutes = (chargePerLessThanTenMinutes: number) =>
		chargePerLessThanTenMinutes ?? 0;
	const halfHourCharging = (chargePerHalfHour: number): number => {
		return Math.floor(minutes / halfHour) * chargePerHalfHour;
	};
	const hourlyCharging = (chargePerHour: number): number => {
		return Math.floor(minutes / hour) * chargePerHour;
	};

	const dailyCharging = (chargePerDay: number): number => {
		return Math.floor(minutes / hour / dayInHours) * chargePerDay;
	};

	const monthlyCharging = (chargePerMonth: number): number => {
		return (
			Math.floor(minutes / hour / dayInHours / monthInDays) *
			chargePerMonth
		);
	};

	const noneChargingType = (): number => {
		return -1;
	};

	return {
		lessThanTenMinutes,
		halfHourCharging,
		hourlyCharging,
		dailyCharging,
		monthlyCharging,
		noneChargingType,
	};
}
