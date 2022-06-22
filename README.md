## How to start
1. Development
- Database
  ```bash
  docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=test mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
  ```
- Server
  ```bash
  cd server
  pip install --no-cache-dir --use-deprecated=legacy-resolver -r requirements.txt
  uvicorn app.main:app --reload
  ```
- Web
  ```bash
  cd web
  npm install
  npm run start
  ```

2. Production
- Docker Compose
  ```bash
  docker-compose down && docker-compose build && docker-compose up -d
  ```