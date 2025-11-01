.PHONY: typegen build zip clean dev seed

GO ?= $(shell command -v go)

VERSION ?= 0.0.600


# Create zip with build
build:
	rm -rf build
	mkdir -p build
	"$(GO)" build -o ./build/backend
	cd ./frontend && bun install
	cd ./frontend && bun run build
	cp -r ./frontend/dist ./build/frontend