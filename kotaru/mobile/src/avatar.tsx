import type { AvatarProps } from './avatar-types';

export type { AvatarProps } from './avatar-types';

/**
 * En iOS y Android, de momento, el retrato de siempre: el visor 3D de la web usa WebGL del
 * navegador. Metro elige `avatar.web.tsx` en la webapp.
 */
export function Avatar({ fallback }: AvatarProps) {
  return <>{fallback}</>;
}
