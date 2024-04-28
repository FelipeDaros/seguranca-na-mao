buildando o banco 

docker build -t my-custom-postgres .

docker run -d --name my-postgres-container --restart always -p 5432:5432 my-custom-postgres
