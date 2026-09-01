import * as migration_20260901_095802_initial from './20260901_095802_initial';

export const migrations = [
  {
    up: migration_20260901_095802_initial.up,
    down: migration_20260901_095802_initial.down,
    name: '20260901_095802_initial'
  },
];
