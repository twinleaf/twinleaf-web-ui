
.PHONY: help
help: ## Print info about all commands
	@echo "Commands:"
	@echo
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[01;32m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: deps
deps: ## Checks that all the dependencies are available, and installs modules
	cargo --version
	npm --version
	npm install  # this means deps AND dev deps
	npm run tauri info

.PHONY: test
test: ## Run all tests (cargo)
	cd src-tauri && cargo test

.PHONY: lint
lint: ## Run syntax/style checks (cargo clippy)
	cd src-tauri && cargo clippy -- --no-deps

.PHONY: fmt
fmt: ## Run syntax re-formatting (cargo)
	cd src-tauri && cargo fmt

.PHONY: build-tauri
build-tauri: build-js ## Build Tauri desktop application for dev (cargo)
	cd src-tauri && cargo build

.PHONY: build-js
build-js: ## Build Javascript bundle (esbuild)
	node_modules/.bin/esbuild web/main.js --bundle --outfile=web/js/twinleaf-web-ui.js --minify

.PHONY: dev-js
dev-js: ## Run Javascript devserver (esbuild)
	node_modules/.bin/esbuild web/main.js --bundle --outfile=web/js/twinleaf-web-ui.js --servedir=web --serve=127.0.0.1:5555

.PHONY: dev-tauri
dev-tauri: ## Run Tauri desktop app for dev (tauri CLI)
	npm run tauri dev

.PHONY: build-release
build-release: build-js ## Build desktop app for release (cargo)
	cd src-tauri && cargo build --release

.PHONY: dist
dist: build-js ## Build desktop app "bundles" (tauri CLI)
	npm run tauri build
