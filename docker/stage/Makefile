build :
	mkdir -p app
	cp -r ../../search.js ../../srv app
	docker build -t nodezoo-search:1 .
	docker build -t nodezoo-search-prod:1 -f Dockerfile-prod .

clean :
	rm *~

.PHONY : build clean
