import type { UsageLedger } from '@kotaru/billing';
import type { GrantClaimStore } from '@kotaru/gateway';
import { GrantRepository, UsageRepository, type SqlClient } from '@kotaru/persistence';

export interface DurableStores {
  readonly usage: UsageLedger;
  readonly grantClaims: GrantClaimStore;
}

/**
 * El consumo y los grants usados, en PostgreSQL.
 *
 * Es lo que hace que reiniciar o redesplegar el gateway no le devuelva minutos a nadie
 * ni deje reutilizar un grant. `UsageRepository` cumple `UsageLedger` por forma; el
 * grant solo necesita traducir segundos epoch a fecha.
 */
export function durableStores(sql: SqlClient): DurableStores {
  const grants = new GrantRepository(sql);
  return {
    usage: new UsageRepository(sql),
    grantClaims: {
      claim: (jti, expSeconds) => grants.claim(jti, new Date(expSeconds * 1000)),
    },
  };
}
