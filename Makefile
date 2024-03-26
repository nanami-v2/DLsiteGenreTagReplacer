
srcDir      := src
outDir      := dist
entryPoints := $(shell find $(srcDir) -type f -name main-*)

.PHONY: build
build:
	npx esbuild $(entryPoints) --bundle --outdir=$(outDir)

.PHONY: clean
clean:
	find $(outDir) -type f -name \*.js | xargs rm 

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict

