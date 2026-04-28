import { startTransition, useDeferredValue, useState } from 'react';

type Scenario = {
  id: string;
  label: string;
  promise: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  stack: string[];
  bars: Array<{
    label: string;
    value: number;
  }>;
  panelClass: string;
  accentClass: string;
};

const scenarios: Scenario[] = [
  {
    id: 'launch',
    label: 'Launch week',
    promise:
      'Keep the hero cinematic while the browser stays light on first paint.',
    summary:
      'Astro delivers the shell, React wakes only the planner, and the CTA path stays sharp under paid traffic spikes.',
    metricLabel: 'Pipeline lift',
    metricValue: '+28%',
    stack: [
      'Hero motion as an island',
      'Fast static edge delivery',
      'CTA stack tuned for paid traffic',
    ],
    bars: [
      { label: 'Attention capture', value: 92 },
      { label: 'Narrative clarity', value: 78 },
      { label: 'Qualified handoff', value: 64 },
    ],
    panelClass: 'from-coral/20 via-white to-sun/25',
    accentClass: 'bg-coral',
  },
  {
    id: 'precision',
    label: 'Precision mode',
    promise:
      'Shift the message by segment without turning the page into a heavy app shell.',
    summary:
      'Each surface stays mostly static, but the interactive planner can switch operating modes as the audience changes.',
    metricLabel: 'Return on spend',
    metricValue: '+19%',
    stack: [
      'Audience-led storytelling',
      'Deferred React hydration',
      'Single visual system across sections',
    ],
    bars: [
      { label: 'Segment fit', value: 88 },
      { label: 'Page rhythm', value: 73 },
      { label: 'Follow-through', value: 69 },
    ],
    panelClass: 'from-lagoon/18 via-white to-cloud',
    accentClass: 'bg-lagoon',
  },
  {
    id: 'board',
    label: 'Board readout',
    promise:
      'Show confidence, operating tempo, and next actions in one controlled frame.',
    summary:
      'The island acts like a compact command deck so stakeholders can test the message without navigating away.',
    metricLabel: 'Decision speed',
    metricValue: '4.2x',
    stack: [
      'Single island, contained bundle',
      'Sharp contrast for executive readouts',
      'Production shape matches Vercel output',
    ],
    bars: [
      { label: 'Signal density', value: 84 },
      { label: 'Stakeholder trust', value: 81 },
      { label: 'Action readiness', value: 76 },
    ],
    panelClass: 'from-ink via-slate-900 to-slate-800',
    accentClass: 'bg-sun',
  },
];

export default function LiveSignalBoard() {
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const deferredActiveId = useDeferredValue(activeId);
  const current =
    scenarios.find((scenario) => scenario.id === deferredActiveId) ??
    scenarios[0];
  const isDarkPanel = current.id === 'board';

  return (
    <div className="rounded-[32px] border border-black/10 bg-white/85 p-6 shadow-[0_30px_120px_rgba(9,16,29,0.16)] backdrop-blur lg:p-8">
      <div className="flex flex-wrap gap-3">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === current.id;

          return (
            <button
              key={scenario.id}
              type="button"
              className={[
                'rounded-full border px-4 py-2 text-sm font-medium transition duration-300',
                isActive
                  ? 'border-transparent bg-ink text-white shadow-[0_10px_30px_rgba(9,16,29,0.18)]'
                  : 'border-black/10 bg-white text-ink hover:border-black/25 hover:bg-black/[0.03]',
              ].join(' ')}
              onClick={() => {
                startTransition(() => {
                  setActiveId(scenario.id);
                });
              }}
              aria-pressed={isActive}
            >
              {scenario.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          className={[
            'rounded-[28px] border p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
            isDarkPanel
              ? 'border-white/10 text-white'
              : 'border-black/10 text-ink',
            `bg-gradient-to-br ${current.panelClass}`,
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-current/60">
                Active scenario
              </p>
              <h3 className="mt-3 font-display text-2xl leading-tight lg:text-3xl">
                {current.promise}
              </h3>
            </div>
            <span className="rounded-full border border-current/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-current/65">
              {current.metricLabel}
            </span>
          </div>

          <div className="mt-8 flex items-end gap-4">
            <span className="font-display text-5xl leading-none lg:text-6xl">
              {current.metricValue}
            </span>
            <p className="max-w-xs text-sm leading-6 text-current/72">
              {current.summary}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {current.stack.map((item) => (
              <div
                key={item}
                className={[
                  'rounded-2xl border px-4 py-4 text-sm leading-6',
                  isDarkPanel
                    ? 'border-white/10 bg-white/6'
                    : 'border-black/10 bg-white/72',
                ].join(' ')}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-paper/90 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-ink/50">
                Signal mix
              </p>
              <h3 className="mt-3 font-display text-2xl text-ink">
                Control the page rhythm
              </h3>
            </div>
            <span className={`h-3 w-3 rounded-full ${current.accentClass}`} />
          </div>

          <div className="mt-8 space-y-5">
            {current.bars.map((bar) => (
              <div key={bar.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-ink/70">
                  <span>{bar.label}</span>
                  <span>{bar.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-black/8">
                  <div
                    className={`h-3 rounded-full ${current.accentClass} transition-[width] duration-500`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
