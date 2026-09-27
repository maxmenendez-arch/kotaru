import type { UsageLedger } from '@kotaru/billing';
import type { GrantClaimStore } from '@kotaru/gateway';
import type { MemoryRepository } from '@kotaru/memory';
import {
  ConversationRepository,
  GrantRepository,
  SafetyEventRepository,
  SqlMemoryRepository,
  UsageRepository,
  type ConversationRepositoryOptions,
  type SqlClient,
} from '@kotaru/persistence';
import type { ConversationLog, SafetyLog } from './session.js';

export interface DurableStores {
  readonly usage: UsageLedger;
  readonly grantClaims: GrantClaimStore;
  readonly memories: MemoryRepository;
  readonly conversations: ConversationLog;
  readonly safety: SafetyLog;
}

/**
 * El consumo, los grants usados y los recuerdos, en PostgreSQL.
 *
 * Es lo que hace que reiniciar o redesplegar el gateway no le devuelva minutos a nadie
 * ni deje reutilizar un grant. `UsageRepository` cumple `UsageLedger` por forma; el
 * grant solo necesita traducir segundos epoch a fecha.
 */
export function durableStores(sql: SqlClient, retention: ConversationRepositoryOptions = {}): DurableStores {
  const grants = new GrantRepository(sql);
  return {
    usage: new UsageRepository(sql),
    memories: new SqlMemoryRepository(sql),
    conversations: new ConversationRepository(sql, retention),
    safety: new SafetyEventRepository(sql),
    grantClaims: {
      claim: (jti, expSeconds) => grants.claim(jti, new Date(expSeconds * 1000)),
    },
  };
}
