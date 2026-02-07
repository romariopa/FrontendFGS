import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-900">
          Tu futuro financiero comienza hoy
        </h1>
        <p className="text-xl text-muted-foreground">
          Descubre nuestros productos de ahorro, simula tus ganancias y abre tu cuenta en minutos.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 w-full max-w-5xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>Conoce nuestras cuentas de ahorro</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">Explora tasas competitivas y beneficios exclusivos.</p>
            <Link href="/products">
              <Button className="w-full">Ver Productos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Simulador</CardTitle>
            <CardDescription>Proyecta tus ahorros</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">Calcula cuánto puedes ganar con el interés compuesto.</p>
            <Link href="/simulator">
              <Button className="w-full" variant="secondary">Simular Ahorro</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Abre tu Cuenta</CardTitle>
            <CardDescription>100% Digital</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">Proceso rápido y seguro sin filas ni papeleo.</p>
            <Link href="/onboarding">
              <Button className="w-full" variant="outline">Comenzar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
