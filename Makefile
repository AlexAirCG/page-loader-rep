install:
	npm ci

test:
	npm test

lint:
	npx oxlint

format:
	npx oxfmt --write

.PHONY: install test lint format