start:
	make start-dapp
	make start-front-end

start-dapp:
	cd ./hstx-dapp && \
	npm start

start-front-end:
	cd ./hstx-front-end && \
	npm run serve

install:
	make install-dapp && \
	make install-front-end

install-dapp:
	cd ./hstx-dapp && \
	npm install

install-front-end:
	cd ./hstx-front-end && \
	npm install