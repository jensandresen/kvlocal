NAME=$(or ${CONTAINER_NAME},kvlocal)
HOST_DATA_DIR=${DATA_DIR}

build:
	docker build -t $(NAME) .

setup: build

run:
	-docker rm $(NAME)
	docker run -d \
		-p 15000:3000 \
		-v $(HOST_DATA_DIR):/data \
		-e KVLOCAL_DATA_DIR="/data" \
		--restart unless-stopped \
		--name $(NAME) \
		$(NAME)

teardown:
	-docker kill $(NAME)

test:
	cd src && KVLOCAL_DATA_DIR=$(abspath ./test-data-dir) npm start

unittests:
	cd src && npm run tests:watch