# Project Rules & Design Guidelines - ASCII Vision Editor

## Core Identity
- **Name:** ASCII Vision Editor v2.0
- **Aesthetic:** High-precision terminal, technical documentation style, "RAW TRANSFORM" manifesto.
- **Palette:** Black, White, and Terminal Green accents.

## Navigation & Layout Logic
- **Landing Page 1 (Manifesto):** Tampilkan halaman ini saat tidak ada gambar yang diunggah atau kamera tidak aktif (`isInitialState`). Halaman ini berisi judul besar italic dan tombol impor data.
- **Landing Page 2 (Editor View):** Tampilkan sidebar dan canvas saat sebuah gambar sudah masuk atau kamera aktif. Jika canvas kosong tapi sidebar terbuka, tampilkan status "Ready_ Awaiting Data Input".
- **Sidebar Persistence:** Secara default sidebar tertutup (`false`) saat pertama kali masuk ke mode editor untuk fokus pada visual.
- **Sidebar Interactions:**
    - Gunakan scrollbar semi-transparan putih (`bg-white/10`) yang halus.
    - Implementasikan fitur "Auto-Scroll" ke bagian **Render Config** secara otomatis setelah pengguna mengimpor data atau mengaktifkan kamera.
    - Sediakan tombol "Back to Top" yang subtil di bagian paling bawah sidebar untuk navigasi cepat kembali ke atas.
- **Canvas Behavior:** Posisi kanvas harus tetap diam (static position) dan tidak boleh bergeser saat sidebar dibuka atau ditutup (jangan gunakan `layout` prop pada container kanvas yang menyebabkan pergerakan mendadak).

## Feature Specifics
- **Canvas Interaction:** Implementasikan fitur Zoom In/Out menggunakan mouse scroll yang dikombinasikan dengan tombol `Ctrl` atau `Cmd`.
- **Integrated Optics:** Gabungkan fitur Brightness, Contrast, Sharpen, Grayscale, Blur, dan Sepia ke dalam satu bagian yaitu "Render Config" untuk efisiensi ruang.
- **Status "Under Construction":** Bagian nomor 5 (Platform Simulation) dan bagian "Light Optics" (yang sekarang isinya sudah dipindah) harus menampilkan teks "Under Construction" dengan animasi pulse.

## Interaction Patterns
- Tutup semua dropdown menu di sidebar secara otomatis saat pengguna mengaktifkan Kamera atau mengklik tombol Impor Data untuk memberikan ruang visual yang bersih.
- Gunakan font "Inter" untuk UI dan "JetBrains Mono" untuk data teknis.
