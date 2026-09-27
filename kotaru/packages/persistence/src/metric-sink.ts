import { assertNoContent, type CostEvent, type MetricSink, type TurnMetric } from '@kotaru/telemetry';
import type { SqlClient } from './client.js';

/**
 * Metricas de turno en `app.turn_metrics`: latencias y costo por turno, sin contenido.
 *
 * `emitTurn` es sincrono en la interfaz (la orquestacion no espera a la telemetria), asi
 * que la escritura sale en segundo plano. Un fallo no corta la conversacion, pero tampoco
 * desaparece: se cuenta en `failures` para que la salud del servicio lo muestre.
 */
export class SqlMetricSink implements MetricSink {
  readonly #sql: SqlClient;
  readonly #pending = new Set<Promise<void>>();
  failures = 0;
  written = 0;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  emitTurn(metric: TurnMetric): void {
    // Antes de tocar la base: si alguien cuela contenido en una metrica, falla aqui.
    assertNoContent(metric as unknown as Record<string, unknown>);
    const write = this.#sql
      .query(
        `insert into app.turn_metrics (turn_id, conversation_id, route_id, stt_provider, llm_provider, tts_provider,
           endpoint_to_final_ms, llm_ttft_ms, tts_ttfb_ms, turn_total_ms, user_speech_ms,
           stt_cost_usd, llm_cost_usd, tts_cost_usd, infra_cost_usd, total_cost_usd, cost_basis,
           fallback_used, interrupted, created_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
         on conflict (turn_id) do nothing`,
        [
          metric.turnId, metric.conversationId, metric.routeId,
          metric.sttProvider ?? null, metric.llmProvider ?? null, metric.ttsProvider ?? null,
          round(metric.endpointToFinalMs), round(metric.llmTtftMs), round(metric.ttsTtfbMs),
          Math.round(metric.turnTotalMs), round(metric.userSpeechMs),
          metric.sttCostUsd, metric.llmCostUsd, metric.ttsCostUsd, metric.infraCostUsd, metric.totalCostUsd,
          metric.costBasis, metric.fallbackUsed, metric.interrupted, metric.createdAt,
        ],
      )
      .then(
        () => {
          this.written += 1;
        },
        () => {
          this.failures += 1;
        },
      );
    this.#pending.add(write);
    void write.finally(() => this.#pending.delete(write));
  }

  emitCost(_event: CostEvent): void {
    // Los eventos de costo por llamada ya estan resumidos en la metrica del turno.
  }

  /** Espera a que terminen las escrituras en curso. Para el apagado limpio y las pruebas. */
  async flush(): Promise<void> {
    await Promise.all([...this.#pending]);
  }
}

function round(value: number | undefined): number | null {
  return value === undefined ? null : Math.round(value);
}
