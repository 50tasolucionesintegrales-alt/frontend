import Image from "next/image";
import Link from "next/link";

type SessionLogo = {
  ruta?: string;
}
type AuthLogo = {
  ruta?: string;
}

type LogoProps = SessionLogo | AuthLogo;

export default function Logo(props: LogoProps) {
  const ruta = props.ruta === '/' ? '/' : `${props.ruta}`;
  return (
    <Link href={ruta} className="text-xl font-bold select-none">
      <Image src="/LOGOSINCUENTAB.png" alt="Cursify" width={60} height={0} className=" block rounded-lg" priority />
    </Link>
  )
}
