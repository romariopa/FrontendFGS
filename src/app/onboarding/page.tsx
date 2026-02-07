"use client";

import { useState } from "react";
import { submissionService, OnboardingData } from "@/services/submissionService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";

export default function OnboardingPage() {
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    document: "",
    email: "",
    recaptchaToken: "", // Hidden field
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const [isHuman, setIsHuman] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Validate Recaptcha
      if (formData.recaptchaToken !== "OK") {
        throw new Error("Por favor verifica que no eres un robot.");
      }

      const response = await submissionService.submit(formData);

      if (response.success && response.requestId) {
        setRequestId(response.requestId);
        setStatus("success");
      } else {
        throw new Error(response.error || "Error al procesar la solicitud.");
      }
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado.");
      }
    }
  };

  const handleRecaptcha = (checked: boolean) => {
    setIsHuman(checked);
    setFormData((prev) => ({
      ...prev,
      recaptchaToken: checked ? "OK" : "",
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      document: "",
      email: "",
      recaptchaToken: "",
    });
    setIsHuman(false);
    setStatus("idle");
    setRequestId("");
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center border-green-200 bg-green-50">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">¡Solicitud Exitosa!</CardTitle>
            <CardDescription className="text-green-700">
              Hemos recibido tus datos correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Tu código de seguimiento es:
            </p>
            <div className="bg-white p-3 rounded border border-green-200 font-mono text-lg font-bold text-gray-800 select-all">
              {requestId}
            </div>
            <p className="text-xs text-gray-500">
              Te hemos enviado un correo de confirmación.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={resetForm}>
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Apertura de Cuenta Digital</CardTitle>
          <CardDescription>
            Completa tus datos para iniciar el proceso. Es rápido y seguro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Nombre Completo"
                placeholder="Como aparece en tu documento"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={status === "loading"}
              />
              
              <Input
                label="Número de Documento"
                placeholder="Ej. 1234567890"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                required
                disabled={status === "loading"}
              />
              
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={status === "loading"}
              />

              {/* Recaptcha Simulado */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recaptcha"
                  className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={isHuman}
                  onChange={(e) => handleRecaptcha(e.target.checked)}
                  disabled={status === "loading"}
                />
                <label htmlFor="recaptcha" className="text-sm text-gray-700 font-medium cursor-pointer flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  No soy un robot
                </label>
                {/* Campo oculto real */}
                <input type="hidden" name="recaptchaToken" value={formData.recaptchaToken} />
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Spinner className="mr-2" />
                  Procesando...
                </>
              ) : (
                "Enviar Solicitud"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
