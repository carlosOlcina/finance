import { startTransition, useDeferredValue, useState } from 'react';

type PocketBlueprint = {
  id: string;
  name: string;
  mode: 'percentage' | 'fixed' | 'remainder';
  value: number;
  note: string;
  accent: string;
  tint: string;
};

type MethodBlueprint = {
  id: string;
  name: string;
  share: number;
  note: string;
  accent: string;
  tint: string;
};

type PocketAllocation = PocketBlueprint & {
  amount: number;
};

type MethodBalance = MethodBlueprint & {
  amount: number;
};

const pocketBlueprints: PocketBlueprint[] = [
  {
    id: 'colchon',
    name: 'Colchon',
    mode: 'percentage',
    value: 0.22,
    note: 'Reserva estable',
    accent: '#1f6a52',
    tint: 'rgba(31,106,82,0.10)',
  },
  {
    id: 'inversion',
    name: 'Inversion',
    mode: 'percentage',
    value: 0.14,
    note: 'Crecimiento',
    accent: '#124c3a',
    tint: 'rgba(18,76,58,0.10)',
  },
  {
    id: 'quedadas',
    name: 'Quedadas',
    mode: 'fixed',
    value: 140,
    note: 'Ocio fijo',
    accent: '#cb7b47',
    tint: 'rgba(203,123,71,0.12)',
  },
  {
    id: 'movilidad',
    name: 'Movilidad',
    mode: 'fixed',
    value: 90,
    note: 'Rutina diaria',
    accent: '#8b5e3c',
    tint: 'rgba(139,94,60,0.12)',
  },
  {
    id: 'libre',
    name: 'Libre',
    mode: 'remainder',
    value: 0,
    note: 'Margen adaptable',
    accent: '#5f7590',
    tint: 'rgba(95,117,144,0.10)',
  },
];

const methodBlueprints: MethodBlueprint[] = [
  {
    id: 'principal',
    name: 'Cuenta principal',
    share: 0.55,
    note: 'Ahorro y base',
    accent: '#1f6a52',
    tint: 'rgba(31,106,82,0.08)',
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta diaria',
    share: 0.3,
    note: 'Gasto corriente',
    accent: '#cb7b47',
    tint: 'rgba(203,123,71,0.10)',
  },
  {
    id: 'efectivo',
    name: 'Efectivo',
    share: 0.15,
    note: 'Imprevistos y calle',
    accent: '#5f7590',
    tint: 'rgba(95,117,144,0.10)',
  },
];

const money = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function buildPockets(income: number): PocketAllocation[] {
  let allocated = 0;

  return pocketBlueprints.map((pocket) => {
    if (pocket.mode === 'remainder') {
      return {
        ...pocket,
        amount: Math.max(income - allocated, 0),
      };
    }

    const amount =
      pocket.mode === 'percentage'
        ? Math.round(income * pocket.value)
        : pocket.value;

    allocated += amount;

    return {
      ...pocket,
      amount,
    };
  });
}

function buildMethods(income: number): MethodBalance[] {
  let assigned = 0;

  return methodBlueprints.map((method, index) => {
    const isLast = index === methodBlueprints.length - 1;
    const amount = isLast
      ? income - assigned
      : Math.round(income * method.share);

    assigned += amount;

    return {
      ...method,
      amount,
    };
  });
}

function formatRule(pocket: PocketAllocation) {
  if (pocket.mode === 'percentage') {
    return `${Math.round(pocket.value * 100)}%`;
  }

  if (pocket.mode === 'fixed') {
    return `${money.format(pocket.value)} fijo`;
  }

  return 'Resto disponible';
}

export default function YieldPlanner() {
  const [income, setIncome] = useState(1650);
  const [expense, setExpense] = useState(68);
  const [activePocketId, setActivePocketId] = useState('quedadas');
  const [activeMethodId, setActiveMethodId] = useState('tarjeta');

  const deferredIncome = useDeferredValue(income);
  const deferredExpense = useDeferredValue(expense);

  const pockets = buildPockets(deferredIncome);
  const methods = buildMethods(deferredIncome);

  const activePocket =
    pockets.find((pocket) => pocket.id === activePocketId) ?? pockets[0];
  const activeMethod =
    methods.find((method) => method.id === activeMethodId) ?? methods[0];

  const fixedTotal = pockets
    .filter((pocket) => pocket.mode === 'fixed')
    .reduce((total, pocket) => total + pocket.amount, 0);
  const percentageTotal = pockets
    .filter((pocket) => pocket.mode === 'percentage')
    .reduce((total, pocket) => total + pocket.amount, 0);
  const freeTotal =
    pockets.find((pocket) => pocket.mode === 'remainder')?.amount ?? 0;

  const pocketAfterExpense = activePocket.amount - deferredExpense;
  const methodAfterExpense = activeMethod.amount - deferredExpense;
  const totalAfterExpense = deferredIncome - deferredExpense;
  const alerts = [
    pocketAfterExpense < 0
      ? `La hucha ${activePocket.name} se queda en ${money.format(pocketAfterExpense)}.`
      : null,
    methodAfterExpense < 0
      ? `El medio ${activeMethod.name} no cubre ese gasto y quedaria en ${money.format(methodAfterExpense)}.`
      : null,
  ].filter(Boolean) as string[];

  return (
    <section className="grid gap-8 rounded-[2.4rem] border border-[var(--line)] bg-[rgba(255,252,247,0.78)] p-6 shadow-[var(--shadow-soft)] backdrop-blur xl:grid-cols-[0.95fr_1.05fr] xl:p-8">
      <div className="space-y-5">
        <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--text-300)]">
          Demo interactiva
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl font-semibold leading-tight text-[var(--text-100)] md:text-4xl">
            Prueba una entrada, reparte el dinero y descuenta un gasto real.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-300)] md:text-base">
            La logica es intencionalmente simple: una parte entra por
            porcentaje, otra por importe fijo y el gasto se imputa tanto a la
            hucha elegida como al medio con el que pagas.
          </p>
        </div>

        <label className="grid gap-3 rounded-[1.8rem] border border-[var(--line)] bg-white/72 p-5">
          <div className="flex items-center justify-between text-sm text-[var(--text-300)]">
            <span>Entrada general</span>
            <strong className="text-[var(--text-100)]">
              {money.format(deferredIncome)}
            </strong>
          </div>
          <input
            type="range"
            min="900"
            max="3600"
            step="50"
            value={income}
            onChange={(event) => setIncome(Number(event.target.value))}
            className="accent-[var(--accent-strong)]"
          />
        </label>

        <label className="grid gap-3 rounded-[1.8rem] border border-[var(--line)] bg-white/72 p-5">
          <div className="flex items-center justify-between text-sm text-[var(--text-300)]">
            <span>Gasto atribuido</span>
            <strong className="text-[var(--text-100)]">
              {money.format(deferredExpense)}
            </strong>
          </div>
          <input
            type="range"
            min="20"
            max="320"
            step="4"
            value={expense}
            onChange={(event) => setExpense(Number(event.target.value))}
            className="accent-[var(--highlight)]"
          />
        </label>

        <div>
          <p className="mb-3 text-sm font-medium text-[var(--text-200)]">
            Desde que hucha sale el gasto
          </p>
          <div className="flex flex-wrap gap-3">
            {pockets.map((pocket) => (
              <button
                key={pocket.id}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setActivePocketId(pocket.id);
                  });
                }}
                className="rounded-full border px-4 py-2 text-sm font-medium transition"
                style={{
                  borderColor:
                    pocket.id === activePocket.id
                      ? pocket.accent
                      : 'var(--line)',
                  backgroundColor:
                    pocket.id === activePocket.id
                      ? pocket.tint
                      : 'rgba(255,255,255,0.7)',
                  color: 'var(--text-100)',
                }}
              >
                {pocket.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-[var(--text-200)]">
            Con que medio lo pagas
          </p>
          <div className="flex flex-wrap gap-3">
            {methods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setActiveMethodId(method.id);
                  });
                }}
                className="rounded-full border px-4 py-2 text-sm font-medium transition"
                style={{
                  borderColor:
                    method.id === activeMethod.id
                      ? method.accent
                      : 'var(--line)',
                  backgroundColor:
                    method.id === activeMethod.id
                      ? method.tint
                      : 'rgba(255,255,255,0.7)',
                  color: 'var(--text-100)',
                }}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-900)] p-5 text-sm leading-7 text-[var(--text-300)]">
          Las huchas explican para que es el dinero. Los medios explican donde
          esta. El gasto se descuenta de ambas capas para que el control no se
          rompa al primer pago.
        </div>
      </div>

      <div className="grid gap-5 rounded-[1.9rem] border border-[var(--line)] bg-white/72 p-5">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--surface-900)] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono-display text-[11px] uppercase tracking-[0.24em] text-[var(--text-300)]">
                  Huchas
                </p>
                <h3 className="font-display mt-3 text-3xl text-[var(--text-100)]">
                  Reparto actual
                </h3>
              </div>
              <span className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1 text-xs text-[var(--text-300)]">
                {money.format(deferredIncome)}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {pockets.map((pocket) => {
                const isActive = pocket.id === activePocket.id;
                const after = isActive ? pocketAfterExpense : pocket.amount;

                return (
                  <div
                    key={pocket.id}
                    className="rounded-[1.4rem] border p-4 transition"
                    style={{
                      borderColor: isActive ? pocket.accent : 'var(--line)',
                      backgroundColor: isActive
                        ? pocket.tint
                        : 'rgba(255,255,255,0.76)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
                          {pocket.note}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[var(--text-100)]">
                          {pocket.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-300)]">
                          Regla
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--text-200)]">
                          {formatRule(pocket)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-2xl font-semibold text-[var(--text-100)]">
                        {money.format(pocket.amount)}
                      </p>
                      {isActive ? (
                        <p
                          className="text-sm font-medium"
                          style={{
                            color:
                              after < 0
                                ? 'var(--highlight)'
                                : 'var(--text-300)',
                          }}
                        >
                          Despues del gasto: {money.format(after)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--surface-900)] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono-display text-[11px] uppercase tracking-[0.24em] text-[var(--text-300)]">
                  Medios
                </p>
                <h3 className="font-display mt-3 text-3xl text-[var(--text-100)]">
                  Donde esta el dinero
                </h3>
              </div>
              <span className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1 text-xs text-[var(--text-300)]">
                {activeMethod.name}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {methods.map((method) => {
                const isActive = method.id === activeMethod.id;
                const after = isActive ? methodAfterExpense : method.amount;

                return (
                  <div
                    key={method.id}
                    className="rounded-[1.4rem] border p-4 transition"
                    style={{
                      borderColor: isActive ? method.accent : 'var(--line)',
                      backgroundColor: isActive
                        ? method.tint
                        : 'rgba(255,255,255,0.76)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
                          {method.note}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[var(--text-100)]">
                          {method.name}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-200)]">
                        {Math.round(method.share * 100)}%
                      </p>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-2xl font-semibold text-[var(--text-100)]">
                        {money.format(method.amount)}
                      </p>
                      {isActive ? (
                        <p
                          className="text-sm font-medium"
                          style={{
                            color:
                              after < 0
                                ? 'var(--highlight)'
                                : 'var(--text-300)',
                          }}
                        >
                          Despues del pago: {money.format(after)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--accent-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">
              Entradas porcentuales
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--text-100)]">
              {money.format(percentageTotal)}
            </p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--highlight-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-200)]">
              Asignacion fija
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--text-100)]">
              {money.format(fixedTotal)}
            </p>
          </article>
          <article className="rounded-[1.4rem] border border-[var(--line)] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
              Saldo total tras gasto
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--text-100)]">
              {money.format(totalAfterExpense)}
            </p>
            <p className="mt-2 text-sm text-[var(--text-300)]">
              Libre antes del gasto: {money.format(freeTotal)}
            </p>
          </article>
        </div>

        {alerts.length > 0 ? (
          <div className="rounded-[1.5rem] border border-[rgba(203,123,71,0.28)] bg-[rgba(203,123,71,0.12)] p-4 text-sm leading-7 text-[var(--text-200)]">
            {alerts.map((alert) => (
              <p key={alert}>{alert}</p>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-900)] p-4 text-sm leading-7 text-[var(--text-300)]">
            Este ejemplo mantiene sincronizado el proposito del dinero con el
            lugar desde el que pagas. Si cambias la hucha o el medio veras una
            foto distinta del mismo movimiento.
          </div>
        )}
      </div>
    </section>
  );
}
