import { describe, expect, it } from 'vitest';
import { guardMemoryText } from '../src/index.js';

describe('guardia de memoria', () => {
  it('deja pasar un recuerdo corriente', () => {
    expect(guardMemoryText('me gusta caminar por la playa al atardecer')).toEqual({ allowed: true });
  });

  it('bloquea un numero de tarjeta valido', () => {
    expect(guardMemoryText('mi tarjeta es 4242 4242 4242 4242')).toEqual({
      allowed: false,
      reason: 'payment_card',
    });
  });

  it('no confunde una cifra larga cualquiera con una tarjeta', () => {
    // Falla Luhn, asi que no es una tarjeta.
    expect(guardMemoryText('el codigo del edificio es 1234567890123').allowed).toBe(true);
  });

  it('bloquea un numero de seguridad social', () => {
    expect(guardMemoryText('mi ssn es 123-45-6789')).toEqual({
      allowed: false,
      reason: 'government_id',
    });
  });

  it('bloquea credenciales', () => {
    expect(guardMemoryText('mi contrasena es girasol77').reason).toBe('credential');
    expect(guardMemoryText('my password is hunter2').reason).toBe('credential');
  });

  it('no archiva una senal de crisis, ni con acentos', () => {
    expect(guardMemoryText('a veces quiero morirme').reason).toBe('crisis_signal');
    expect(guardMemoryText('a veces quiero morírme').reason).toBe('crisis_signal');
    expect(guardMemoryText('sometimes I want to kill myself').reason).toBe('crisis_signal');
  });

  it('la crisis tiene prioridad sobre cualquier otra regla', () => {
    expect(guardMemoryText('quiero morir, mi tarjeta es 4242424242424242').reason).toBe('crisis_signal');
  });
});
