
import { useEffect, useState } from 'react';

interface CountdownProps {
    startDate: Date;
    endDate: Date;
}

const useCountdown = ({ startDate, endDate }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            if (now < startDate) {
                setTimeLeft('Countdown not started yet');
                return;
            }
            const endTime = endDate.getTime();
            const currentTime = now.getTime();
            const milliDiff = endTime - currentTime;

            if (milliDiff <= 0) {
                setTimeLeft('00:00');
                return;
            }

            const totalSeconds = Math.floor(milliDiff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
            const minutes = String(totalMinutes % 60).padStart(2, '0');

            setTimeLeft(`${hours}:${minutes}`);
        };

        calculateTimeLeft(); // Initial calculation
        const intervalId = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [startDate, endDate]);

    return { timeLeft };
};

export default useCountdown;

