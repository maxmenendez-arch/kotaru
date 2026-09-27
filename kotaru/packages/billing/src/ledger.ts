import { UsageMeter, type MeterSnapshot, type UsageEntry } from './meter.js';

/**
 * Libro de consumo, visto desde quien lo usa.
 *
 * Asincrono porque la implementacion de produccion es PostgreSQL
 * (`UsageRepository` en @kotaru/persistence, que cumple esta interfaz por forma, sin
 * importarla). Con el medidor en memoria, reiniciar el gateway borraba el consumo del
 * mes: un usuario recuperaba sus minutos y el tope de gasto volvia a cero.
 */
export interface UsageLedger {
  /** true si se conto; false si el turno ya estaba registrado. */
  record(entry: UsageEntry): Promise<boolean>;
  forSubject(subjectId: string): Promise<MeterSnapshot>;
  /** Gasto acumulado del periodo, en todos los usuarios. */
  totalCostUsd(): Promise<number>;
  /** Gasto acumulado del periodo en turnos del plan gratuito. */
  freeCostUsd(): Promise<number>;
}

/** El medidor en memoria detras de la interfaz asincrona. Para pruebas y la demo. */
export class InMemoryUsageLedger implements UsageLedger {
  readonly meter: UsageMeter;

  constructor(meter: UsageMeter = new UsageMeter()) {
    this.meter = meter;
  }

  async record(entry: UsageEntry): Promise<boolean> {
    return this.meter.record(entry);
  }

  async forSubject(subjectId: string): Promise<MeterSnapshot> {
    return this.meter.forSubject(subjectId);
  }

  async totalCostUsd(): Promise<number> {
    return this.meter.totalCostUsd();
  }

  async freeCostUsd(): Promise<number> {
    return this.meter.freeCostUsd();
  }
}
