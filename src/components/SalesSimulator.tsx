import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface Product {
  name: string;
  lpPerUnit: number;
  color: string;
  maxDaily: number;
}

const products: Product[] = [
  { name: 'TF Plus', lpPerUnit: 55, color: 'from-emerald-500 to-emerald-600', maxDaily: 50 },
  { name: 'Energy Go Stix', lpPerUnit: 18, color: 'from-orange-500 to-orange-600', maxDaily: 100 },
  { name: 'RioVida Stix', lpPerUnit: 10, color: 'from-purple-500 to-purple-600', maxDaily: 100 },
];

const SalesSimulator: React.FC = () => {
  const [daysInMonth, setDaysInMonth] = useState(20);
  const [dailySales, setDailySales] = useState([0, 0, 0]);
  const [commissionPct] = useState(0.40);
  const [lpValue] = useState(4);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculations = {
    monthlyQuantities: dailySales.map(daily => daily * daysInMonth),
    monthlyLPs: dailySales.map((daily, index) => daily * daysInMonth * products[index].lpPerUnit),
    get totalLP() {
      return this.monthlyLPs.reduce((sum, lp) => sum + lp, 0);
    },
    get isEligible() {
      return this.totalLP >= 100;
    },
    get monthlyEarnings() {
      return this.isEligible ? commissionPct * (this.totalLP - 100) * lpValue : 0;
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setDaysInMonth(value);
  };

  const handleSliderChange = (productIndex: number, value: number[]) => {
    const newSales = [...dailySales];
    newSales[productIndex] = value[0];
    setDailySales(newSales);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-subtle p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Simulador de Ganhos 4Life
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Descubra o potencial dos seus ganhos com vendas digitais dos produtos 4Life. Configure seus dias de trabalho e vendas diárias para ver o resultado em tempo real.
            </p>
          </div>

          {/* Parameters Section */}
          <Card className="mb-8 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Parâmetros do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="days" className="text-sm font-medium">
                    Dias trabalhados no mês
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min="0"
                    value={daysInMonth}
                    onChange={handleDaysChange}
                    className="mt-2"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm text-muted-foreground">Comissão em LPs</div>
                  <div className="text-2xl font-semibold text-success">
                    {(commissionPct * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm text-muted-foreground">Valor do LP</div>
                  <div className="text-2xl font-semibold text-primary">
                    {formatCurrency(lpValue)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Sales Section */}
          <Card className="mb-8 shadow-medium">
            <CardHeader>
              <CardTitle>Vendas Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div key={product.name} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">{product.name}</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{product.lpPerUnit} LPs por unidade</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-3">
                      <Slider
                        value={[dailySales[index]]}
                        onValueChange={(value) => handleSliderChange(index, value)}
                        max={product.maxDaily}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">0</span>
                        <span className="font-semibold text-primary">
                          {dailySales[index]} unid/dia
                        </span>
                        <span className="text-muted-foreground">{product.maxDaily}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warning for zero days */}
          {daysInMonth === 0 && (
            <div className="mb-8 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <p className="text-warning-foreground">
                Defina ao menos 1 dia de trabalho para simular seus ganhos.
              </p>
            </div>
          )}

          {/* Product Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {products.map((product, index) => (
              <Card key={product.name} className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${product.color}`} />
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unidades/mês:</span>
                    <span className="font-semibold">{calculations.monthlyQuantities[index]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LPs/mês:</span>
                    <span className="font-semibold text-primary">
                      {calculations.monthlyLPs[index].toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Section */}
          <Card className="shadow-strong bg-gradient-to-r from-card to-secondary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                Resultado da Simulação
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-5 h-5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ganho = {(commissionPct * 100)}% × (LPs - 100) × {formatCurrency(lpValue)}</p>
                    <p className="text-xs mt-1">100 LPs são para ativação pessoal</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total de LPs no mês</div>
                  <div className="text-3xl font-bold text-primary">
                    {calculations.totalLP.toLocaleString()} LPs
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">LPs para comissão</div>
                  <div className="text-2xl font-bold text-accent">
                    {calculations.isEligible ? (calculations.totalLP - 100).toLocaleString() : 0} LPs
                  </div>
                  <div className="text-xs text-muted-foreground">
                    (100 LPs para ativação pessoal)
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Status de elegibilidade</div>
                  <div className="flex items-center gap-2">
                    {calculations.isEligible ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-success font-semibold">Elegível (≥100 LPs)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-warning" />
                        <span className="text-warning font-semibold">
                          Abaixo de 100 LPs (sem ganho)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Ganho estimado no mês</div>
                  <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {formatCurrency(calculations.monthlyEarnings)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              * Simulação baseada em {(commissionPct * 100)}% de comissão sobre (LPs - 100) × {formatCurrency(lpValue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Os primeiros 100 LPs são destinados à ativação pessoal e não geram comissão
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SalesSimulator;