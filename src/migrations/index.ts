import * as migration_20260901_095802_initial from './20260901_095802_initial';
import * as migration_20260901_105349_tambah_jabatan_lengkap from './20260901_105349_tambah_jabatan_lengkap';
import * as migration_20260901_110835_data_kelembagaan_dan_fasilitas from './20260901_110835_data_kelembagaan_dan_fasilitas';
import * as migration_20260901_112706_layanan_berjenjang_dan_angka_pelayanan from './20260901_112706_layanan_berjenjang_dan_angka_pelayanan';

export const migrations = [
  {
    up: migration_20260901_095802_initial.up,
    down: migration_20260901_095802_initial.down,
    name: '20260901_095802_initial',
  },
  {
    up: migration_20260901_105349_tambah_jabatan_lengkap.up,
    down: migration_20260901_105349_tambah_jabatan_lengkap.down,
    name: '20260901_105349_tambah_jabatan_lengkap',
  },
  {
    up: migration_20260901_110835_data_kelembagaan_dan_fasilitas.up,
    down: migration_20260901_110835_data_kelembagaan_dan_fasilitas.down,
    name: '20260901_110835_data_kelembagaan_dan_fasilitas',
  },
  {
    up: migration_20260901_112706_layanan_berjenjang_dan_angka_pelayanan.up,
    down: migration_20260901_112706_layanan_berjenjang_dan_angka_pelayanan.down,
    name: '20260901_112706_layanan_berjenjang_dan_angka_pelayanan'
  },
];
