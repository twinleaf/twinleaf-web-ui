
.PHONY: help
help: ## Print info about all commands
	@echo "Commands:"
	@echo
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[01;32m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: deps
deps: ## Checks that all the dependencies are available, and installs modules
	cargo --version
	cargo tauri --version || true
	npm --version
	npm install  # this means deps AND dev deps

.PHONY: test
test: ## Run all tests
	cd desktop-tauri && cargo test

.PHONY: lint
lint: ## Run syntax/style checks
	cd desktop-tauri && cargo clippy -- --no-deps

.PHONY: fmt
fmt: ## Run syntax re-formatting
	cd desktop-tauri && cargo fmt

.PHONY: build-desktop
build-desktop: ## Build Tauri desktop application
	cd desktop-tauri && cargo build

.PHONY: build-js
build-js: ## Build Javascript bundle
	node_modules/.bin/esbuild desktop-web/main.js --bundle --outfile=desktop-web/js/twinleaf-web-ui.js

.PHONY: dev-js
dev-js: ## Run Javascript devserver
	node_modules/.bin/esbuild desktop-web/main.js --bundle --outfile=desktop-web/js/twinleaf-web-ui.js --servedir=desktop-web --serve=127.0.0.1:5555

.PHONY: dev-tauri
dev-tauri: ## Run Tauri devserver
	cargo tauri dev

.PHONY: build-release
build-release: ## Build for release
	cd desktop-tauri && cargo build --release
