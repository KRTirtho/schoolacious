help: 
			echo "See the file yourself"

up: 
			docker-compose up -d

down: 
			docker-compose down

dev: 
			docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

build-dev: 
						docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

prod: 
			docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

build-prod: 
			docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

exec: 
			docker exec -it veschool_titumir_1 $(con) sh -c "$(cmd)"