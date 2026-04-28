import { useState } from 'react';

const tiers = {
  Core: 3.4,
  Flow: 4.2,
  Horizon: 5.1,
} as const;

type Tier = keyof typeof tiers;

const money = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function estimateInterest(
  monthlySweep: number,
  months: number,
  annualRate: number,
) {
  const averageBalance = monthlySweep * ((months + 1) / 2);
  return averageBalance * (annualRate / 100) * (months / 12);
}

export default function YieldPlanner() {
  const [tier, setTier] = useState<Tier>('Flow');
  const [monthlySweep, setMonthlySweep] = useState(18000);
  const [months, setMonths] = useState(12);

  const annualRate = tiers[tier];
  const baselineRate = 0.8;
  const managedCash = monthlySweep * months;
  const projectedYield = estimateInterest(monthlySweep, months, annualRate);
  const baselineYield = estimateInterest(monthlySweep, months, baselineRate);
  const upside = projectedYield - baselineYield;

  return (
    <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-[rgba(8,14,26,0.78)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur xl:grid-cols-[0.95fr_1.05fr] xl:p-8">
      <div className="space-y-5">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--text-300)]">
          React island
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Simula el barrido automático de caja sin abandonar la página
            estática.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-300)] md:text-base">
            Astro entrega la shell de forma ultrarrápida y React hidrata solo
            este panel para que tu equipo pruebe escenarios de liquidez en
            tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(tiers) as Tier[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTier(option)}
              className={[
                'rounded-full border px-4 py-2 text-sm font-medium transition',
                tier === option
                  ? 'border-[var(--accent)] bg-[rgba(112,240,194,0.14)] text-white'
                  : 'border-white/10 bg-white/5 text-[var(--text-300)] hover:border-white/20 hover:text-white',
              ].join(' ')}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 rounded-[1.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5">
        <label className="grid gap-3">
          <div className="flex items-center justify-between text-sm text-[var(--text-300)]">
            <span>Barrido mensual</span>
            <strong className="text-white">{money.format(monthlySweep)}</strong>
          </div>
          <input
            type="range"
            min="5000"
            max="80000"
            step="1000"
            value={monthlySweep}
            onChange={(event) => setMonthlySweep(Number(event.target.value))}
            className="accent-[var(--accent-strong)]"
          />
        </label>

        <label className="grid gap-3">
          <div className="flex items-center justify-between text-sm text-[var(--text-300)]">
            <span>Horizonte</span>
            <strong className="text-white">{months} meses</strong>
          </div>
          <input
            type="range"
            min="3"
            max="18"
            step="1"
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
            className="accent-[var(--highlight)]"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
              Caja gestionada
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {money.format(managedCash)}
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
              Yield estimado
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {money.format(projectedYield)}
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
              Upside vs. banco
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--accent)]">
              {money.format(upside)}
            </p>
          </article>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/4 p-4 text-sm leading-7 text-[var(--text-300)]">
          <div className="flex items-center justify-between">
            <span>Plan seleccionado</span>
            <strong className="text-white">{tier}</strong>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Tasa anual ilustrativa</span>
            <strong className="text-white">{annualRate.toFixed(1)}%</strong>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Cuenta operativa tradicional</span>
            <strong className="text-white">{baselineRate.toFixed(1)}%</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
