dev:
	pnpm run dev

build:
	pnpm run build

test:
	pnpm run test

lint:
	pnpm run lint

format:
	pnpm run format

pre-ci:
	pnpm run lint && \
	pnpm run format && \
	pnpm run test:run

license-add:
	node scripts/manage-license-headers.js add

license-remove:
	node scripts/manage-license-headers.js remove

license-check:
	node scripts/manage-license-headers.js check
