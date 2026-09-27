// Metro con acceso al cliente compartido del monorepo (../packages/client).
// La app NO es parte de los workspaces de npm a proposito: asi instalar el servidor no
// descarga React Native, y la app no arrastra dependencias del servidor.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [path.join(root, 'packages/client/src')];
config.resolver.extraNodeModules = {
  '@kotaru/client': path.join(root, 'packages/client/src'),
};
// El cliente importa de @kotaru/gateway solo TIPOS, que Babel borra: nada del servidor
// llega al paquete de la app.
config.resolver.nodeModulesPaths = [path.join(__dirname, 'node_modules')];

// El monorepo escribe los imports relativos con extension .js (ESM de Node) aunque el
// archivo sea .ts. Metro no hace esa traduccion por su cuenta.
const shared = path.join(root, 'packages') + path.sep;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (context.originModulePath.startsWith(shared) && moduleName.startsWith('.') && moduleName.endsWith('.js')) {
    return context.resolveRequest(context, moduleName.slice(0, -3) + '.ts', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
