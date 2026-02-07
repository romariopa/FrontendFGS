import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-blue-800">
          Simulador Ahorro
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost">Productos</Button>
          </Link>
          <Link href="/simulator">
            <Button variant="ghost">Simulador</Button>
          </Link>
          <Link href="/onboarding">
            <Button>Abrir Cuenta</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
