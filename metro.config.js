// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Para que Metro vigile también node_modules de tu proyecto
config.watchFolders = [
  path.resolve(__dirname, 'node_modules'),
];

// Mapea require('tslib') al tslib de tu root
config.resolver.extraNodeModules = {
  tslib: path.resolve(__dirname, 'node_modules/tslib'),
  ...config.resolver.extraNodeModules,
};

module.exports = config;
