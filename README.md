# Vicoders NestJS Starter
- [Vicoders NestJS Starter](#vicoders-nestjs-starter)
  - [Giới thiệu](#giới-thiệu)
  - [Setup](#setup)
  - [Cấu trúc thư mục](#cấu-trúc-thư-mục)
  - [Cấu hình](#cấu-hình)
  - [Migration & Seed](#migration--seed)
  - [Command](#command)

<a name="giới-thiệu"></a>
## Giới thiệu

Thông tin về [NestJS](https://docs.nestjs.com/)

<a name="setup"></a>
## Setup

Clone project từ github

```
git clone https://github.com/vicodersvn/nestjs-starter
```
<a name="cấu-trúc-thư-mục"></a>
## Cấu trúc thư mục

Dùng lệnh tree để xem cấu trúc thư mục 
```
tree -L 4 -I 'node_modules|dist|test|README*|tsconfig*|yarn*'
```

<a name="cấu-hình"></a>
## Cấu hình

Cấu hình cơ bản của hệ thống sẽ được lưu trong file `.env`.
Để bắt đầu, khởi tạo file `.env` với nội dung giống file `.env.example`

Cấu hình thông tin cơ bản
```
# Tên ứng dụng
APP_NAME=
# Môi trường ứng dụng đang hoạt động, có thể là local, testing hoặc production
APP_ENV=
# Chuỗi bất kì dùng để mã hoá token của user
APP_KEY=
# Thời gian hợp lệ của token
JWT_TTL=2592000000
# Enable / Disable debug or logging
APP_DEBUG=true
```

Cấu hình database
```
# Loại database sử dụng `mysql`, `postgres`, `cockroachdb`, `mariadb`, `sqlite`, `better-sqlite3`, `cordova`, `nativescript`, `oracle`, `mssql`, `mongodb`, `sqljs`, `react-native`
# Ứng với mỗi loại sẽ cần cài thêm các package đi kèm
# Mặc định KIT đang hỗ trợ mysql
DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
# Enable / Disable log tất cả các query vào file `ormlogs.log`
DB_LOGGING=true
```

Cấu hình email
```
MAIL_MAILER=smtp
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=true
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=from@example.com
```

<a name="migration--seed"></a>
## Migration & Seed

Migration giống như việc có thể quản lí database của bạn, nó hỗ trợ tạo mới, chỉnh sửa cũng như khôi phục database của bạn.

Các file migration của hệ thống được lưu trong `database/migrations`

Để tạo một file migration mới
```
yarn migration:create FileNameHere
```

Ví dụ:
```
yarn migration:create CreateUsersTable
```

Migrate database

```
yarn db:migrate
```

Trên production lệnh migrate sẽ được chạy tự động mỗi khi application start

> thông tin chi tiết tại file config `config/database.ts`


Để thêm thông tin mặc định cho các bảng trong database chúng ta có thể dùng seeder, để tạo mới một file seeder chúng ta có lệnh
```
yarn command make:seeder SeederFileName
```
Ví dụ:
```
yarn command make:seeder UsersTableSeeder
```
<a name="command"></a>
## Command

Hệ thống hỗ trợ sẵn để xây dựng các câu lệnh tuỳ biến, điều này hỗ trợ rất nhiều trong quá trình phát triển sản phẩm.
Các câu lệnh được lưu tại `src/console/Commands`

Để tạo một command mới 
```
yarn command make:command CommandNameHere
```

Ví dụ:

```
yarn command make:command MyCustomCommand
```

Sau khi khởi tạo command bạn cần khai báo vào hệ thống để có thể sử dụng, để khai báo bạn cần cập nhật thông tin ở file `src/console/Kernel.ts`

Về cách sử dụng command hãy kiểm tra ghi chú trong file vừa tạo
