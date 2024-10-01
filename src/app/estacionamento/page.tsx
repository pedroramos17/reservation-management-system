import BookingPage from "@/lib/features/bookings/Booking";

interface BookingPageProps {
    readonly searchParams?: {
      query?: string;
    };
  }
export default function Page({ searchParams }: BookingPageProps) {
       const query = searchParams?.query ?? '';
    return <BookingPage query={query} />;
}