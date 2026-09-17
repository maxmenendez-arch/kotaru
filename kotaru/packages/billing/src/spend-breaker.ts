/**
 * Escalera de corte de gasto.
 *
 * Del documento de economia: 50% avisa, 75% apaga lo prescindible, 90% degrada todas
 * las rutas a la economica y el plan gratuito pierde voz pero conserva texto, 100%
 * corta la voz por completo y la app sigue en texto con un aviso honesto.
 *
 * Un tope que nunca se ha disparado no es un tope. Hay pruebas que simulan gasto
 * acumulado y comprueban cada escalon.
 */
export type SpendLevel = 'normal' | 'notify' | 'freeze_nonessential' | 'degrade' | 'halt';

export interface SpendPolicy {
  readonly level: SpendLevel;
  readonly notifyOwner: boolean;
  /** Apaga benchmarks y entorno de staging. */
  readonly stopNonEssential: boolean;
  readonly freezeInvites: boolean;
  /** Fuerza la ruta economica a todos los planes, incluido el premium. */
  readonly forceEconomical: boolean;
  /** El plan gratuito pierde voz; conserva el texto. */
  readonly disableFreeVoice: boolean;
  /** Interruptor general de voz. La app sigue funcionando en texto. */
  readonly voiceKillSwitch: boolean;
  readonly spentFraction: number;
}

export interface SpendBudget {
  /** Tope duro mensual. Por encima de esto no se gasta nada mas en voz. */
  readonly hardCapUsd: number;
}

export const SPEND_THRESHOLDS = { notify: 0.5, freeze: 0.75, degrade: 0.9, halt: 1 } as const;

export function evaluateSpend(spentUsd: number, budget: SpendBudget): SpendPolicy {
  const fraction = budget.hardCapUsd > 0 ? spentUsd / budget.hardCapUsd : Number.POSITIVE_INFINITY;

  if (fraction >= SPEND_THRESHOLDS.halt) {
    return policy('halt', fraction, {
      notifyOwner: true,
      stopNonEssential: true,
      freezeInvites: true,
      forceEconomical: true,
      disableFreeVoice: true,
      voiceKillSwitch: true,
    });
  }
  if (fraction >= SPEND_THRESHOLDS.degrade) {
    return policy('degrade', fraction, {
      notifyOwner: true,
      stopNonEssential: true,
      freezeInvites: true,
      forceEconomical: true,
      disableFreeVoice: true,
      voiceKillSwitch: false,
    });
  }
  if (fraction >= SPEND_THRESHOLDS.freeze) {
    return policy('freeze_nonessential', fraction, {
      notifyOwner: true,
      stopNonEssential: true,
      freezeInvites: true,
      forceEconomical: false,
      disableFreeVoice: false,
      voiceKillSwitch: false,
    });
  }
  if (fraction >= SPEND_THRESHOLDS.notify) {
    return policy('notify', fraction, {
      notifyOwner: true,
      stopNonEssential: false,
      freezeInvites: false,
      forceEconomical: false,
      disableFreeVoice: false,
      voiceKillSwitch: false,
    });
  }
  return policy('normal', fraction, {
    notifyOwner: false,
    stopNonEssential: false,
    freezeInvites: false,
    forceEconomical: false,
    disableFreeVoice: false,
    voiceKillSwitch: false,
  });
}

function policy(
  level: SpendLevel,
  spentFraction: number,
  flags: Omit<SpendPolicy, 'level' | 'spentFraction'>,
): SpendPolicy {
  return { level, spentFraction, ...flags };
}

/** Proyeccion simple a fin de mes, para que el aviso del 50% diga algo util. */
export function projectMonthEndUsd(
  spentUsd: number,
  dayOfMonth: number,
  daysInMonth: number,
): number {
  if (dayOfMonth <= 0) return spentUsd;
  return (spentUsd / dayOfMonth) * daysInMonth;
}
