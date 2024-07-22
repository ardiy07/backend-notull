# Backend Notull - Aplikasi Terinspirasi dari Trello

Backend Notull adalah aplikasi yang terinspirasi dari [Trello](https://trello.com/), dibangun menggunakan ExpressJS untuk backend dan MySQL sebagai basis datanya. Aplikasi ini menyediakan API untuk mengelola tugas dan catatan dengan fitur-fitur seperti pembuatan, pembaruan, dan penghapusan catatan.

## Daftar Isi

- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)

## Instalasi

### Prasyarat

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/)

### Setup Backend (ExpressJS)

1. Clone repository:

    ```bash
    git clone https://github.com/username/backend-notull.git
    cd backend-notull
    ```

2. Instal dependensi Node.js:

    ```bash
    npm install
    ```

3. Buat database MySQL dan konfigurasi koneksi database di file `.env`:

    ```bash
    cp .env.example .env
    ```

    Ubah nilai berikut pada file `.env` sesuai dengan kredensial database MySQL Anda:

    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=notull
    ```

4. Jalankan migrasi database:

    ```bash
    npx sequelize-cli db:migrate
    ```

5. Jalankan server development ExpressJS:

    ```bash
    npm start
    ```

## Penggunaan

- Buka browser atau aplikasi API client (seperti Postman) dan navigasikan ke `http://localhost:3000` untuk mengakses API.

