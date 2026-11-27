// Metro (Expo): ignora a pasta do CRM de PC (tem o próprio node_modules e não faz parte do site).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const extra = [/[\\/]crm[\\/].*/];
const cur = config.resolver.blockList;
config.resolver.blockList = [].concat(cur ? (Array.isArray(cur) ? cur : [cur]) : [], extra);

module.exports = config;
