/**
 * Error de un proveedor real, con lo que el router necesita para decidir.
 *
 * `retryable` distingue lo pasajero (limite de ritmo, sobrecarga, red) de lo que no se
 * arregla reintentando (clave invalida, peticion mal formada). El mensaje nunca incluye
 * el texto de la conversacion ni la clave del proveedor: solo codigos y estados.
 */
export class ProviderError extends Error {
  readonly providerId: string;
  readonly code: string;
  readonly retryable: boolean;
  readonly status?: number;

  constructor(providerId: string, code: string, retryable: boolean, status?: number) {
    super(`${providerId}: ${code}${status !== undefined ? ` (${status})` : ''}`);
    this.name = 'ProviderError';
    this.providerId = providerId;
    this.code = code;
    this.retryable = retryable;
    if (status !== undefined) this.status = status;
  }
}
