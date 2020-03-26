all: dev-setup lint test

# Development environment
dev-setup: clean-dev npm-init

npm-init:
	npm install

# Cleaning
clean-dev:
	rm -rf node_modules

# Testing
test:
	npm run test

test-coverage:
	npm run test:coverage

# Linting
lint:
	npm run lint

lint-fix:
	npm run lint:fix
