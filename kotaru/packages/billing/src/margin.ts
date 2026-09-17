import { PLANS, type PlanId } from './plans.js';

/**
 * Economia de planes. Esta aqui y no en una hoja de calculo porque es una
 * restriccion del producto, no un analisis: si una asignacion deja de cumplir el
 * margen objetivo, una prueba debe fallar antes de que el precio llegue a la tienda.
 */

export interface MarginInputs {
  readonly planId: PlanId;
  readonly costPerHourUsd: number;
  readonly commissionRate: number;
  /** Fraccion del plan que consume el usuario p95. Supuesto explicito: 0.9. */
  readonly p95Utilization: number;
}

export function netRevenueUsd(planId: PlanId, commissionRate: number): number {
  return PLANS[planId].priceUsd * (1 - commissionRate);
}

/**
 * Margen para una combinacion arbitraria de precio y horas. Existe separado de los
 * planes para poder preguntar "y si el plan llevara 50 horas?" sin editar el catalogo.
 */
export function marginForHours(options: {
  readonly priceUsd: number;
  readonly includedHours: number;
  readonly costPerHourUsd: number;
  readonly commissionRate: number;
  readonly p95Utilization: number;
}): number {
  if (options.priceUsd === 0) return Number.NEGATIVE_INFINITY;
  const net = options.priceUsd * (1 - options.commissionRate);
  const cost = options.includedHours * options.p95Utilization * options.costPerHourUsd;
  return (net - cost) / net;
}

/** Margen de contribucion en el usuario p95, entre 0 y 1. Negativo si pierde dinero. */
export function contributionMarginP95(inputs: MarginInputs): number {
  const plan = PLANS[inputs.planId];
  return marginForHours({
    priceUsd: plan.priceUsd,
    includedHours: plan.includedVoiceSeconds / 3600,
    costPerHourUsd: inputs.costPerHourUsd,
    commissionRate: inputs.commissionRate,
    p95Utilization: inputs.p95Utilization,
  });
}

/** Horas maximas que caben en un plan manteniendo el margen objetivo. */
export function maxIncludedHours(options: {
  readonly planId: PlanId;
  readonly costPerHourUsd: number;
  readonly commissionRate: number;
  readonly targetMargin: number;
  readonly p95Utilization: number;
}): number {
  const net = netRevenueUsd(options.planId, options.commissionRate);
  const affordable = net * (1 - options.targetMargin);
  return affordable / (options.p95Utilization * options.costPerHourUsd);
}

/** Lo que cuesta al mes un usuario del plan gratuito que agota su asignacion. */
export function freeTierSubsidyUsd(costPerHourUsd: number): number {
  return (PLANS.free.includedVoiceSeconds / 3600) * costPerHourUsd;
}
