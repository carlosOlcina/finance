export type MarkerItem = {
  label: string;
  value: string;
  detail: string;
};

export type PillarItem = {
  eyebrow: string;
  title: string;
  body: string;
};

export type WorkflowItem = {
  step: string;
  title: string;
  body: string;
};

export type HeroSplitItem = {
  name: string;
  value: string;
};

export type RailItem = {
  title: string;
  body: string;
};

export const repoUrl = 'https://github.com/carlosOlcina/finance';
export const releasesUrl = `${repoUrl}/releases`;

export const markers: MarkerItem[] = [
  {
    label: 'Reglas de entrada',
    value: 'Mixtas',
    detail:
      'Porcentajes, importes fijos y resto libre conviviendo en la misma vista.',
  },
  {
    label: 'Medios separados',
    value: '3 capas',
    detail:
      'Cuenta principal, tarjeta diaria y efectivo sin mezclar el destino del dinero.',
  },
  {
    label: 'Promesa',
    value: 'Simple',
    detail:
      'Sin integraciones bancarias ni contabilidad pesada: un excel automatico y mucho mas claro.',
  },
];

export const pillars: PillarItem[] = [
  {
    eyebrow: 'Huchas con criterio',
    title: 'Cada entrada aterriza con un reparto definido.',
    body: 'Finance reparte el dinero entre inversion, quedadas, reserva o cualquier apartado que decidas. Puedes mezclar porcentajes e importes fijos sin inventarte formulas nuevas cada mes.',
  },
  {
    eyebrow: 'Gasto con destino',
    title: 'Cada movimiento consume una hucha concreta.',
    body: 'Una cena no baja de un total abstracto: baja de Quedadas. Asi entiendes que partidas se estan agotando y cuales siguen intactas antes de abrir el banco.',
  },
  {
    eyebrow: 'Dinero localizado',
    title: 'Sabes para que es y tambien donde esta.',
    body: 'La app separa el sentido del dinero de su ubicacion. Puedes mirar tus huchas y, al mismo tiempo, ver cuanto sigue en cuenta, tarjeta o efectivo.',
  },
];

export const workflow: WorkflowItem[] = [
  {
    step: '01',
    title: 'Crea tus apartados',
    body: 'Inversion, quedadas, colchon, vacaciones o lo que necesites. Cada apartado representa una intencion real, no una etiqueta decorativa.',
  },
  {
    step: '02',
    title: 'Define como entra el dinero',
    body: 'Decide que porcentajes se reparten automaticamente, que cantidades son fijas y cuanto queda libre para improvisar sin perder el control.',
  },
  {
    step: '03',
    title: 'Atribuye cada gasto y cada medio',
    body: 'Cuando pagas algo eliges de que hucha sale y con que medio lo haces. Finance actualiza ambas capas a la vez.',
  },
];

export const heroBuckets: HeroSplitItem[] = [
  { name: 'Colchon', value: '22%' },
  { name: 'Inversion', value: '14%' },
  { name: 'Quedadas', value: '140 EUR' },
  { name: 'Movilidad', value: '90 EUR' },
  { name: 'Libre', value: 'Resto' },
];

export const heroMethods: HeroSplitItem[] = [
  { name: 'Cuenta principal', value: '55%' },
  { name: 'Tarjeta diaria', value: '30%' },
  { name: 'Efectivo', value: '15%' },
];

export const rails: RailItem[] = [
  {
    title: 'Las huchas responden a una pregunta: para que es este dinero.',
    body: 'Aqui viven tus objetivos y tus limites. Una hucha puede ser ahorro, otra ocio y otra un gasto fijo. Lo importante es que cada euro tenga intencion antes de salir.',
  },
  {
    title: 'Los medios responden a otra: donde esta ahora mismo.',
    body: 'Cuenta bancaria, tarjeta o efectivo. Finance mantiene esa capa separada para que el saldo real y el presupuesto convivan sin pisarse.',
  },
];

export const openSourceNotes = [
  'Proyecto completamente open source, pensado para evolucionar en publico.',
  'Instalacion prevista desde GitHub y distribucion del APK mediante releases.',
  'Sin sincronizacion bancaria: el foco es darte claridad, no prometer automatismos dudosos.',
];
