import DriverForm from '@/lib/common/components/forms/DriverForm';

export default function EditFormDriver({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;

  return (
    <DriverForm id={id} />
  );
}
