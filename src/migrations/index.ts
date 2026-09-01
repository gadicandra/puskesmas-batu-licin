import * as migration_20260901_095802_initial from './20260901_095802_initial';
import * as migration_20260901_105349_tambah_jabatan_lengkap from './20260901_105349_tambah_jabatan_lengkap';

export const migrations = [
  {
    up: migration_20260901_095802_initial.up,
    down: migration_20260901_095802_initial.down,
    name: '20260901_095802_initial',
  },
  {
    up: migration_20260901_105349_tambah_jabatan_lengkap.up,
    down: migration_20260901_105349_tambah_jabatan_lengkap.down,
    name: '20260901_105349_tambah_jabatan_lengkap'
  },
];
