# EOSPDS-server
[1. 準備資料庫](#1-準備資料庫) <br/>
[1.1 安裝資料庫](#11-安裝資料庫) <br/>
[1.2 建立資料庫和使用者](#12-建立資料庫和使用者) <br/>
[1.3 修改專案mysql連線設定檔](#13-修改專案mysql連線設定檔) <br/>
[2. 設定專案環境變數 `.env`](#2-設定專案環境變數env)

---

## 1. 準備資料庫
### 1.1 安裝資料庫
1. 安裝`Ubuntu-Server 20.04`版本，官方網站下載位置[點我下載](https://ubuntu.com/download/server)
2. 更新ubuntu server
```shell
sudo apt-get update
sudo apt-get upgrade
```
3. 安裝net-tools套件(`ifconfig`, `netstat`)
```shell
sudo apt-get install net-tools
```
4. 更新完成後，重開機
```shell
sudo reboot
```
5. 登入ubuntu安裝`mysql-server`和`mysql-client`套件
```shell
sudo apt-get install mysql-server
sudo apt install mysql-client
sudo apt install libmysqlclient-dev
```
6. 確認mysql伺服器有安裝成功
```shell
netstat -tap | grep mysql
```
7. 取得mysql預設使用者和密碼`cat /etc/mysql/debian.cnf`
```
# Automatically generated for Debian scripts. DO NOT TOUCH!
[client]
host     = localhost
user     = debian-sys-maint   <----預設帳號在這裡
password = bpagQ5IT6rJxTkXc   <----預設密碼在這裡
socket   = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host     = localhost
user     = debian-sys-maint
password = bpagQ5IT6rJxTkXc
socket   = /var/run/mysqld/mysqld.sock
```
8. 確認是否可以登入mysql，輸入完以下指令後，請輸入上方的預設密碼
```shell
mysql -u 上方的預設帳號名稱 -p
```
9. 登入後，應會長下面這個樣子
```sql=
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 11
Server version: 8.0.23-0ubuntu0.20.04.1 (Ubuntu)

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```
10. 檢查是否可以查看，mysql當中有幾個資料庫
```sql=
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

mysql> 
```
### 1.2 建立資料庫和使用者
1. 登入資料庫
```shell
mysql -u 上方的預設帳號名稱 -p
```
2. 新增可以本機可以使用的使用者
```sql=
mysql> CREATE USER 'eospds-server'@'localhost' IDENTIFIED BY 'eospds-server';
Query OK, 0 rows affected (0.02 sec)
```
3. 新增資料庫`eospds`
```sql=
mysql> CREATE DATABASE eospds;
Query OK, 1 row affected (0.01 sec)
```
4. 確認新增成功
```sql=
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| eospds             |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```
5. 賦予新帳號`eospds-server`擁有`eospds`資料庫的全部權限，包含讀寫
```sql=
mysql> GRANT ALL PRIVILEGES ON eospds.* TO 'eospds-server'@'localhost';
Query OK, 0 rows affected (0.01 sec)
```
6. 確認該使用者是否，能讀取該資料庫，先行登出mysql資料庫，並重新登入，並確認是否能看到`eospds`資料庫在`show databases;`指令中
```sql=
mysql> exit
Bye

$ mysql -u eospds-server -p
[---略---]
type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| eospds             |
| information_schema |
+--------------------+
2 rows in set (0.00 sec)

mysql> 
```

### 1.3 修改專案mysql連線設定檔
修改根目錄下的檔案`ormconfig.json`檔案
```json=
{
  "type": "mysql",
  "host": "資料庫位置",
  "port": 3306,
  "username": "資料庫使用者帳號",
  "password": "資料庫使用者密碼",
  "database": "資料庫名稱",
  "synchronize": true,
  "logging": false,
  "entities": [
    "dist/**/*.entity.js"
  ],
  [---略---]
}
```

## 2. 設定專案環境變數`.env`
於根目錄下新增環境設定檔`.env`
```
# express port
PORT=9487
# 授權鑰匙私鑰
JWT_SECRET=key
# 授權鑰匙預設過期時間
ACCESS_TOKEN_DEFAULT_TIMEOUT='1 day'
# 系統管理員帳號密碼
ADMIN_ACCOUNT=admin
ADMIN_ACCOUNT_PASSWORD=admin
# 允許的連線網址
ALLOW_ORIGIN=http://localhost:4200
```