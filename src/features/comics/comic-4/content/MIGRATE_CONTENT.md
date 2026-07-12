TODO: Migrasi paket konten untuk Comic 4

Tujuan:
- Pindahkan data identifikasi, argumentation, resolution, application, dan assets dari `src/features/learning-engine/content/contentPackages.ts` ke file khusus di folder ini.
- Setelah selesai, `src/features/comics/comic-4/index.ts` harus mengimpor lokal `./content` bukan `contentPackages` global.

Langkah singkat:
1. Buat file `packageContent.ts` berisi objek `LearningContentPackage` hanya untuk komik 4.
2. Uji integrasi dengan `LearningEngine` memastikan `comicModule.packageContent` memuat data yang sama.
3. Hapus ketergantungan runtime ke `getLearningContentPackage(4)`.

Catatan: ini hanya untuk isolasi konten — jangan ubah runtime behavior lainnya.