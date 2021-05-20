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

test: 
			docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

build-test: 
			docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d --build