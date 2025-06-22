# Forum API
**Forum API** adalah sebuah proyek backend yang dibangun menggunakan JavaScript, dirancang untuk menyediakan layanan API bagi aplikasi forum diskusi. Proyek ini mengikuti struktur modular dan dilengkapi dengan pengujian untuk memastikan keandalan dan skalabilitasnya.

## Fitur
- CRUD Threads: Membuat, membaca, memperbarui, dan menghapus thread diskusi.
- Komentar: Menambahkan dan mengelola komentar pada thread.
- Autentikasi: Sistem login dan registrasi pengguna.
- Pengujian: Tersedia pengujian untuk memastikan fungsi-fungsi berjalan dengan baik.

## Struktur Proyek
```
forum-api/
├── migrations/        # Skrip migrasi database
├── src/               # Kode sumber utama
│   ├── api/           # Endpoint API
│   ├── services/      # Logika bisnis
│   └── utils/         # Utilitas dan helper
├── tests/             # Pengujian dengan Jest
├── .editorconfig      # Konfigurasi editor
├── .env               # Variabel lingkungan untuk production
├── .gitignore         # File dan folder yang diabaikan Git
├── .test.env          # Variabel lingkungan untuk pengujian
├── eslint.config.mjs  # Konfigurasi ESLint
├── package.json       # Konfigurasi npm dan dependensi
└── README.md          # Dokumentasi proyek
```

## Instalasi
1. Kloning Repository
    ```
    git clone https://github.com/mufidfarhan/forum-api.git
    cd forum-api
    ```

2. Instalasi Dependensi

    ```
    npm install
    ```
    
3. Konfigurasi Lingkungan\
Buat file .env di direktori root dengan contoh konfigurasi berikut:
    ```
    # Server
    HOST=localhost
    PORT=5000
    NODE_ENV=development
    
    # PostgreSQL
    PGHOST=localhost
    PGUSER=your_user
    PGDATABASE=forumapi
    PGPASSWORD=your_password
    PGPORT=5432
    
    # PostgreSQL untuk pengujian
    PGHOST_TEST=localhost
    PGUSER_TEST=your_user
    PGDATABASE_TEST=forumapi_test
    PGPASSWORD_TEST=your_password
    PGPORT_TEST=5432
    
    # JWT
    ACCESS_TOKEN_KEY=your_access_token_key
    REFRESH_TOKEN_KEY=your_refresh_token_key
    ACCESS_TOKEN_AGE=3600
    ```

4. Migrasi Database
    ```
    npm run migrate up
    ```

## Menjalankan Server
- Untuk menjalankan server:
    ```
    npm start
    ```
- Untuk pengembangan dengan hot reload:
    ```
    npm run start:dev
    ```

## Pengujian
Proyek ini menggunakan Jest untuk pengujian. Untuk menjalankan pengujian:
```
npm run test
```
Pastikan database pengujian telah dikonfigurasi dengan benar di file .env dan .test.env.

