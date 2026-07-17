# Guard khusus comic-2 pada shared component

Dokumen ini mencatat guard yang sengaja ditambahkan agar perubahan navigation dan object detail untuk comic-2 tidak mengubah perilaku comic-1.

## 1. src/features/learning-engine/components/stages/navigationStageContent.ts
- Guard: `comicId === 2`
- Alasan: memastikan resolver navigation memakai data dan asset khusus comic-2, sementara comic-1 tetap memakai jalur lama.
- Perilaku comic-1: tetap memakai objek default, hero model, dan QR asset comic-1.
- Perilaku comic-2: memakai learning object, model utama, dan QR asset khusus comic-2.

## 2. src/features/learning-engine/components/stages/NavigationStage.tsx
- Guard: `const isComic2 = comic.id === 2`
- Alasan: membedakan UI navigation comic-2 yang lebih dekat dengan isi komik dengan tampilan lama untuk comic-1.
- Perilaku comic-1: tetap memakai layout dan daftar objek lama.
- Perilaku comic-2: menampilkan versi khusus dengan objek Candi Penataran, bangun datar, dan kartu yang lebih ringkas.

## 3. src/components/viewers/ObjectDetailClient.tsx
- Guard: `const isComic2 = comicId === 2`
- Alasan: menampilkan detail objek comic-2 yang lebih kaya informasi tanpa mengubah alur viewer comic-1.
- Perilaku comic-1: tetap memakai layout detail lama.
- Perilaku comic-2: menampilkan bagian bangun datar, deskripsi singkat, dan hubungan dengan simetri.

## 4. src/features/learning-engine/components/stages/ObjectAITutor.tsx
- Guard: `const isComic2 = comicId === 2`
- Alasan: membatasi AI Tutor comic-2 pada materi Candi Penataran dan mencegah pertanyaan di luar cakupan mengubah pengalaman comic-1.
- Perilaku comic-1: tetap memakai daftar pertanyaan dan logika AI default.
- Perilaku comic-2: memakai pertanyaan khusus dan mengarahkan pertanyaan di luar cakupan kembali ke materi Candi Penataran.

## 5. src/features/comics/types.ts
- Guard: tidak ada guard runtime; menggunakan field opsional `symmetryConnection?: string`
- Alasan: memberi ruang bagi comic-2 untuk menambahkan data tambahan tanpa memecah kontrak data comic-1.
- Perilaku comic-1: aman karena field bersifat opsional dan tidak dipakai.
- Perilaku comic-2: dapat memuat hubungan objek dengan simetri untuk UI khusus.
