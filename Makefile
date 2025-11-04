.PHONY: typegen build zip clean dev seed

GO ?= $(shell command -v go)

VERSION ?= 0.0.600


typegen:
	"$(GO)" run . migrate up
	bunx pocketbase-typegen --db ./pb_data/data.db --out ./frontend/src/lib/pocketbase-types.ts

dev: typegen
	cd frontend && echo 'const pburl = "http://localhost:8090"; export default pburl;' > src/lib/pburl.ts
	cd frontend && echo 'export const version = "Dev";' > src/lib/version.ts
	"$(GO)" run . serve

# Create zip with build
build:
	cd frontend && echo 'const pburl = "/"; export default pburl;' > src/lib/pburl.ts
	cd frontend && echo 'export const version = "$(VERSION)";' > src/lib/version.ts
	rm -rf build
	mkdir -p build
	"$(GO)" build -o ./build/backend
	cd ./frontend && bun install
	cd ./frontend && bun run build
	cp -r ./frontend/dist ./build/frontend

zip: build
	tar -czf build.tar.gz build/

clean:
	rm -rf build
	rm -rf build.tar.gz
	rm -rf pb_data
	rm -rf frontend/dist
	rm -rf frontend/node_modules