import { describe, expect, it } from 'vitest';
import {
  PLANS,
  SPEND_THRESHOLDS,
  STORE_COMMISSION_SMALL_BUSINESS,
  STORE_COMMISSION_STANDARD,
  UsageMeter,
  contributionMarginP95,
  entitlementFor,
  evaluateSpend,
  freeTierSubsidyUsd,
  marginForHours,
  maxIncludedHours,
  projectMonthEndUsd,
} from '../src/index.js';

const LAUNCH_COST_PER_HOUR = 0.52;
const KOKORO_COST_PER_HOUR = 0.23;
const P95 = 0.9;
const budget = { hardCapUsd: 1000 };

describe('catalogo de planes', () => {
  it('coincide con las asignaciones de D-008', () => {
    expect(PLANS.free.includedVoiceSeconds).toBe(45 * 60);
    expect(PLANS.connect.includedVoiceSeconds).toBe(5 * 3600);
    expect(PLANS.close.includedVoiceSeconds).toBe(12 * 3600);
    expect(PLANS.always.includedVoiceSeconds).toBe(20 * 3600);
  });

  it('el plan gratuito no puede usar la ruta premium ni comprar complementos', () => {
    expect(PLANS.free.allowsPremiumRoute).toBe(false);
    expect(PLANS.free.allowsAddOns).toBe(false);
  });
});

describe('economia de planes', () => {
  it('todos los planes de pago mantienen al menos 50% de margen en el p95', () => {
    for (const planId of ['connect', 'close', 'always'] as const) {
      const margin = contributionMarginP95({
        planId,
        costPerHourUsd: LAUNCH_COST_PER_HOUR,
        commissionRate: STORE_COMMISSION_SMALL_BUSINESS,
        p95Utilization: P95,
      });
      expect(margin, `plan ${planId}`).toBeGreaterThanOrEqual(0.5);
    }
  });

  it('sobreviven tambien al regimen de comision del 30%', () => {
    for (const planId of ['connect', 'close', 'always'] as const) {
      const margin = contributionMarginP95({
        planId,
        costPerHourUsd: LAUNCH_COST_PER_HOUR,
        commissionRate: STORE_COMMISSION_STANDARD,
        p95Utilization: P95,
      });
      expect(margin, `plan ${planId}`).toBeGreaterThan(0.4);
    }
  });

  it('confirma por que Always bajo de 50 horas a 20', () => {
    const at50h = marginForHours({
      priceUsd: PLANS.always.priceUsd,
      includedHours: 50,
      costPerHourUsd: LAUNCH_COST_PER_HOUR,
      commissionRate: STORE_COMMISSION_STANDARD,
      p95Utilization: P95,
    });
    expect(at50h).toBeLessThan(0);
  });

  it('reproduce el techo de horas de D-008 y D-011', () => {
    const at052 = maxIncludedHours({
      planId: 'always',
      costPerHourUsd: LAUNCH_COST_PER_HOUR,
      commissionRate: STORE_COMMISSION_SMALL_BUSINESS,
      targetMargin: 0.5,
      p95Utilization: P95,
    });
    const at023 = maxIncludedHours({
      planId: 'always',
      costPerHourUsd: KOKORO_COST_PER_HOUR,
      commissionRate: STORE_COMMISSION_SMALL_BUSINESS,
      targetMargin: 0.5,
      p95Utilization: P95,
    });

    expect(at052).toBeCloseTo(22.7, 1);
    expect(at023).toBeCloseTo(51.3, 1);
    // Si Kokoro pasa la prueba de calidad, las 35-50 horas originales vuelven a caber.
    expect(at023).toBeGreaterThan(50);
  });

  it('el subsidio del plan gratuito son 0.39 USD por usuario al mes', () => {
    expect(freeTierSubsidyUsd(LAUNCH_COST_PER_HOUR)).toBeCloseTo(0.39, 2);
  });
});

describe('medidor de consumo', () => {
  const entry = (turnId: string, seconds: number, cost: number) => ({
    turnId,
    subjectId: 'subj_1',
    voiceSeconds: seconds,
    costUsd: cost,
    at: 1_789_000_000_000,
  });

  it('acumula por usuario', () => {
    const meter = new UsageMeter();
    meter.record(entry('t1', 30, 0.004));
    meter.record(entry('t2', 45, 0.006));
    expect(meter.forSubject('subj_1')).toEqual({ voiceSeconds: 75, costUsd: 0.01, turns: 2 });
  });

  it('un turno repetido no se cobra dos veces', () => {
    const meter = new UsageMeter();
    expect(meter.record(entry('t1', 30, 0.004))).toBe(true);
    expect(meter.record(entry('t1', 30, 0.004))).toBe(false);
    expect(meter.forSubject('subj_1').turns).toBe(1);
    expect(meter.totalCostUsd()).toBeCloseTo(0.004, 6);
  });

  it('un usuario desconocido tiene consumo cero, no undefined', () => {
    expect(new UsageMeter().forSubject('nadie')).toEqual({ voiceSeconds: 0, costUsd: 0, turns: 0 });
  });
});

describe('escalera de corte de gasto', () => {
  it('por debajo del 50% no hace nada', () => {
    expect(evaluateSpend(499, budget).level).toBe('normal');
  });

  it('avisa exactamente en el 50%', () => {
    const policy = evaluateSpend(budget.hardCapUsd * SPEND_THRESHOLDS.notify, budget);
    expect(policy.level).toBe('notify');
    expect(policy.notifyOwner).toBe(true);
    expect(policy.forceEconomical).toBe(false);
  });

  it('en el 75% apaga lo prescindible y congela invitaciones', () => {
    const policy = evaluateSpend(750, budget);
    expect(policy.level).toBe('freeze_nonessential');
    expect(policy.stopNonEssential).toBe(true);
    expect(policy.freezeInvites).toBe(true);
    expect(policy.disableFreeVoice).toBe(false);
  });

  it('en el 90% degrada todas las rutas y el plan gratuito pierde voz', () => {
    const policy = evaluateSpend(900, budget);
    expect(policy.level).toBe('degrade');
    expect(policy.forceEconomical).toBe(true);
    expect(policy.disableFreeVoice).toBe(true);
    expect(policy.voiceKillSwitch).toBe(false);
  });

  it('en el 100% corta la voz para todos', () => {
    const policy = evaluateSpend(1000, budget);
    expect(policy.level).toBe('halt');
    expect(policy.voiceKillSwitch).toBe(true);
  });

  it('sigue en halt si se pasa del tope', () => {
    expect(evaluateSpend(4000, budget).level).toBe('halt');
  });

  it('proyecta el cierre de mes para que el aviso del 50% sirva de algo', () => {
    expect(projectMonthEndUsd(250, 10, 30)).toBeCloseTo(750, 6);
  });
});

describe('entitlements', () => {
  const normal = evaluateSpend(0, budget);

  it('deja hablar cuando queda saldo', () => {
    const e = entitlementFor({ planId: 'close', usedVoiceSeconds: 3600, spend: normal });
    expect(e.canStartVoice).toBe(true);
    expect(e.remainingVoiceSeconds).toBe(11 * 3600);
    expect(e.denial).toBeUndefined();
  });

  it('al agotar el plan corta la voz pero nunca el texto', () => {
    const e = entitlementFor({ planId: 'connect', usedVoiceSeconds: 5 * 3600, spend: normal });
    expect(e.canStartVoice).toBe(false);
    expect(e.denial).toBe('plan_limit');
    expect(e.canUseText).toBe(true);
    expect(e.canBuyAddOn).toBe(true);
  });

  it('los complementos comprados amplian el saldo', () => {
    const e = entitlementFor({
      planId: 'connect',
      usedVoiceSeconds: 5 * 3600,
      addOnSeconds: 3600,
      spend: normal,
    });
    expect(e.canStartVoice).toBe(true);
    expect(e.remainingVoiceSeconds).toBe(3600);
  });

  it('al 90% Always conserva la voz pero por la ruta economica', () => {
    const e = entitlementFor({ planId: 'always', usedVoiceSeconds: 0, spend: evaluateSpend(900, budget) });
    expect(e.canStartVoice).toBe(true);
    expect(e.quality).toBe('economical');
  });

  it('al 90% el plan gratuito pierde la voz y conserva el texto', () => {
    const spend = evaluateSpend(900, budget);
    const free = entitlementFor({ planId: 'free', usedVoiceSeconds: 0, spend });
    const paid = entitlementFor({ planId: 'connect', usedVoiceSeconds: 0, spend });

    expect(free.canStartVoice).toBe(false);
    expect(free.denial).toBe('free_voice_disabled');
    expect(free.canUseText).toBe(true);
    expect(paid.canStartVoice).toBe(true);
  });

  it('al 100% nadie tiene voz y todos conservan el texto', () => {
    const spend = evaluateSpend(1000, budget);
    for (const planId of ['free', 'connect', 'close', 'always'] as const) {
      const e = entitlementFor({ planId, usedVoiceSeconds: 0, spend });
      expect(e.canStartVoice, `plan ${planId}`).toBe(false);
      expect(e.denial).toBe('spend_cap');
      expect(e.canUseText).toBe(true);
      expect(e.canBuyAddOn, `plan ${planId}`).toBe(false);
    }
  });
});
