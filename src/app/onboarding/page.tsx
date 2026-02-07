"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submissionService, OnboardingData } from "@/services/submissionService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

export default function OnboardingPage() {
  const { t, locale } = useI18n();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    document: "",
    email: "",
    recaptchaToken: "", // Hidden field
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestId, setRequestId] = useState("");

  const isFormValid = formData.fullName.trim() !== "" &&
                      formData.document.trim() !== "" &&
                      formData.email.trim() !== "" &&
                      formData.recaptchaToken !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await submissionService.submit(formData);

      if (response.success && response.requestId) {
        setRequestId(response.requestId);
        setStatus("success");
      } else {
        throw new Error(response.error || t.onboarding.errorGeneric);
      }
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(t.onboarding.errorUnexpected);
      }
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setFormData((prev) => ({
      ...prev,
      recaptchaToken: token || "",
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      document: "",
      email: "",
      recaptchaToken: "",
    });
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
            <CardTitle className="text-2xl text-green-800">{t.onboarding.successTitle}</CardTitle>
            <CardDescription className="text-green-700">
              {t.onboarding.successDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              {t.onboarding.trackingCode}
            </p>
            <div className="bg-white p-3 rounded border border-green-200 font-mono text-lg font-bold text-gray-800 select-all">
              {requestId}
            </div>
            <p className="text-xs text-gray-500">
              {t.onboarding.confirmationEmail}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={resetForm}>
              {t.onboarding.backHome}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 md:py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t.onboarding.title}</CardTitle>
          <CardDescription>
            {t.onboarding.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label={t.onboarding.fullName}
                placeholder={t.onboarding.fullNamePlaceholder}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={status === "loading"}
              />
              
              <Input
                label={t.onboarding.document}
                placeholder={t.onboarding.documentPlaceholder}
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                required
                disabled={status === "loading"}
              />
              
              <Input
                label={t.onboarding.email}
                type="email"
                placeholder={t.onboarding.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={status === "loading"}
              />

              {/* Google reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={handleRecaptchaChange}
                  hl={locale}
                />
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={status === "loading" || !isFormValid}>
              {status === "loading" ? (
                <>
                  <Spinner className="mr-2" />
                  {t.onboarding.processing}
                </>
              ) : (
                t.onboarding.submit
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
