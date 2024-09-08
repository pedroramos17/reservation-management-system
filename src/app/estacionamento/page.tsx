import ParkingSlotPage from "@/lib/features/parkingSlot/ParkingSlot";

interface ParkingLotPageProps {
    readonly searchParams?: {
      query?: string;
    };
  }
export default function Page({ searchParams }: ParkingLotPageProps) {
       const query = searchParams?.query ?? '';
    return <ParkingSlotPage query={query} />;
}