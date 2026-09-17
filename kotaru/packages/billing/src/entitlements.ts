import type { QualityTier } from '@kotaru/ai-contracts';
import { PLANS, type PlanId } from './plans.js';
import type { SpendPolicy } from './spend-breaker.js';

export type VoiceDenial = 'plan_limit' | 'spend_cap' | 'free_voice_disabled';

export interface Entitlement {
  readonly canStartVoice: boolean;
  /**
   * El texto nunca se corta. Cuando la voz se apaga por presupuesto, la app sigue
   * siendo util y el aviso es honesto; dejar al usuario sin nada seria castigarlo por
   * una decision de infraestructura que no tomo el.
   */
  readonly canUseText: true;
  readonly remainingVoiceSeconds: number;
  readonly quality: QualityTier;
  readonly maxSessionSeconds: number;
  readonly idleTimeoutSeconds: number;
  readonly canBuyAddOn: boolean;
  readonly denial?: VoiceDenial;
}

export interface EntitlementInput {
  readonly planId: PlanId;
  readonly usedVoiceSeconds: number;
  readonly spend: SpendPolicy;
  /** Segundos comprados como complemento en este periodo. */
  readonly addOnSeconds?: number;
}

export function entitlementFor(input: EntitlementInput): Entitlement {
  const plan = PLANS[input.planId];
  const allowance = plan.includedVoiceSeconds + (input.addOnSeconds ?? 0);
  const remaining = Math.max(0, allowance - input.usedVoiceSeconds);

  const base = {
    canUseText: true as const,
    remainingVoiceSeconds: remaining,
    quality: resolveQuality(plan, input.spend),
    maxSessionSeconds: plan.maxSessionSeconds,
    idleTimeoutSeconds: plan.idleTimeoutSeconds,
    canBuyAddOn: plan.allowsAddOns && !input.spend.voiceKillSwitch,
  };

  if (input.spend.voiceKillSwitch) {
    return { ...base, canStartVoice: false, denial: 'spend_cap' };
  }
  if (plan.id === 'free' && input.spend.disableFreeVoice) {
    return { ...base, canStartVoice: false, denial: 'free_voice_disabled' };
  }
  if (remaining <= 0) {
    return { ...base, canStartVoice: false, denial: 'plan_limit' };
  }
  return { ...base, canStartVoice: true };
}

/**
 * El nivel de calidad efectivo. El corte de gasto manda sobre el plan: un usuario de
 * Always sigue teniendo voz al 90% del presupuesto, pero por la ruta economica.
 */
function resolveQuality(
  plan: (typeof PLANS)[PlanId],
  spend: SpendPolicy,
): QualityTier {
  if (spend.forceEconomical) return 'economical';
  if (plan.defaultQuality === 'premium' && !plan.allowsPremiumRoute) return 'balanced';
  return plan.defaultQuality;
}
