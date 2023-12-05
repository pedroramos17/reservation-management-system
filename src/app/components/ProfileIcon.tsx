import ProfileSVG from '../img/profile.svg';
import Image from 'next/image'

export default function ProfileIcon() {
  return <Image src={ProfileSVG} alt="Profile Icon" />;
}
