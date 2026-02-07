"use client";

import { useSimulator } from "@/hooks/useSimulator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/format";
import { Calculator } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

export default function SimulatorPage() {
  const { values, setField, errors, isValid, result, calculate } = useSimulator();
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{t.simulator.title}</h1>
        <p className="text-muted-foreground">
          {t.simulator.subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.simulator.contributionsTitle}</CardTitle>
            <CardDescription>{t.simulator.contributionsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                label={t.simulator.initialAmount}
                type="number"
                placeholder="0"
                value={values.initialAmount}
                onChange={(e) => setField("initialAmount", e.target.value)}
                error={errors.initialAmount}
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {values.initialAmount ? formatCurrency(Number(values.initialAmount)) : "$ 0"}
              </p>
            </div>

            <div>
              <Input
                label={t.simulator.monthlyContribution}
                type="number"
                placeholder="0"
                value={values.monthlyContribution}
                onChange={(e) => setField("monthlyContribution", e.target.value)}
                error={errors.monthlyContribution}
                min={0}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {values.monthlyContribution ? formatCurrency(Number(values.monthlyContribution)) : "$ 0"}
              </p>
            </div>

            <div>
              <Input
                label={t.simulator.months}
                type="number"
                placeholder="12"
                value={values.months}
                onChange={(e) => setField("months", e.target.value)}
                error={errors.months}
                min={1}
                max={360}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {values.months ? `${values.months} ${t.simulator.monthsUnit}` : `0 ${t.simulator.monthsUnit}`}
              </p>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={calculate} 
              disabled={!isValid}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {t.simulator.calculateBtn}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="h-full bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">{t.simulator.resultTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!result ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Calculator className="h-12 w-12 mb-2 opacity-20" />
                  <p>{t.simulator.emptyState}</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">{t.simulator.totalContributed}</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatCurrency(result.totalContributed)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">{t.simulator.interestEarned}</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(result.interestEarned)}
                    </p>
                  </div>

                  <div className="bg-blue-600 p-6 rounded-lg shadow-lg text-white">
                    <p className="text-sm text-blue-100 mb-1">{t.simulator.finalBalance}</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(result.finalBalance)}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-4 italic">
                    {t.simulator.disclaimer}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
