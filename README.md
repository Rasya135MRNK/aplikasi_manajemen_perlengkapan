# Aplikasi Manajemen Perlengkapan

Sistem manajemen inventaris barang berbasis web dengan fitur **check-in/check-out**, **peminjaman barang**, **notifikasi WhatsApp otomatis**, dan **unggah gambar barang**. Dibangun dengan arsitektur REST API yang dapat diakses dari desktop maupun mobile.

---

## Fitur & Penjelasan

### Autentikasi & Manajemen Pengguna
Sistem login berbasis **JWT (JSON Web Token)** dengan tiga level akses:
- **Super Admin** &mdash; akses penuh, termasuk kelola pengguna
- **Admin** &mdash; kelola data barang, transaksi, dan laporan
- **Staff** &mdash; hanya dapat melakukan transaksi check-in/check-out dan peminjaman

### Manajemen Barang
CRUD data barang lengkap dengan:
- Kategori barang
- **Upload gambar** (wajib) &mdash; format JPG/PNG/WEBP, maksimal 2 MB
- Stok minimal sebagai ambang batas notifikasi
- Pencarian & filter data

### Transaksi Barang
- **Check-in** &mdash; mencatat barang masuk ke gudang
- **Check-out** &mdash; mencatat barang keluar untuk pemakaian internal

### Peminjaman Barang
Fitur peminjaman dan pengembalian:
- Pencatatan data peminjam (nama, kontak)
- Tanggal pinjam dan tenggat pengembalian
- Status peminjaman (dipinjam / dikembalikan / terlambat)

### Dashboard & Laporan
Ringkasan visual dan laporan interaktif:
- Total barang, stok menipis, barang dipinjam
- Riwayat transaksi dan peminjaman
- Filter berdasarkan tanggal, kategori, status

### Notifikasi WhatsApp (Waha)
Notifikasi otomatis via **WhatsApp Gateway (Waha)** ketika:
- Stok barang berada di bawah batas minimal
- Peminjaman melewati tenggat pengembalian

### Responsive Design
Tampilan responsif menggunakan **Tailwind CSS** &mdash; optimal digunakan di desktop, tablet, maupun smartphone.

---

## Arsitektur & Stack Teknologi

```
                          +------------------------------------+
                          |            Frontend                |
                          |  React + Vite + Tailwind CSS       |
                          |       (Desktop & Mobile)           |
                          +------------------+-----------------+
                                             | HTTP REST API
                          +------------------v-----------------+
                          |            Backend                 |
                          |  Node.js + Express.js + Sequelize  |
                          |        (REST API Server)           |
                          +---+----------+----------+---------+
                              |          |          |
                    +---------v+  +------v------+  +v------------+
                    |  MySQL  |  |    Waha     |  |   Uploads/  |
                    |  (DB)   |  |  (WhatsApp  |  |Images (Local)|
                    |         |  |   Gateway)  |  |             |
                    +---------+  +-------------+  +-------------+
```

| Lapisan | Teknologi |
|---------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, Zustand, Axios |
| **Backend** | Node.js, Express.js, Sequelize ORM |
| **Database** | MySQL 8 |
| **Autentikasi** | JWT (Access & Refresh Token) |
| **Notifikasi** | Waha (WhatsApp Gateway, self-hosted Docker) |
| **Upload Gambar** | Multer (penyimpanan lokal) |
| **Container** | Docker & Docker Compose |

### Struktur Database

- **users** &mdash; data pengguna & role (super_admin, admin, staff)
- **categories** &mdash; kategori barang
- **items** &mdash; master barang (nama, stok, stok minimal, gambar)
- **transactions** &mdash; riwayat check-in / check-out
- **loans** &mdash; data peminjaman & pengembalian
- **notifications** &mdash; log notifikasi WhatsApp

---

## Cara Menjalankan

1. Clone repository
   ```bash
   git clone https://github.com/Rasya135MRNK/aplikasi_manajemen_perlengkapan.git
   cd aplikasi_manajemen_perlengkapan
   ```

2. Salin `.env.example` menjadi `.env` dan isi konfigurasi
   ```bash
   cp .env.example .env
   ```

3. Jalankan dengan Docker Compose
   ```bash
   docker compose up -d
   ```

4. Scan QR code Waha di `http://localhost:3002` untuk menghubungkan WhatsApp

5. Akses aplikasi di `http://localhost`

---

## Lisensi

MIT &copy; 2026 Muhammad Rasya Naufal Khadafi
