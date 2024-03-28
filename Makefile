
srcDir      := src
outDir      := dist
assetDir    := assets
entryPoints := $(shell find $(srcDir) -type f -name main-*)

.PHONY: build
build:
	npx esbuild $(entryPoints) --bundle --outdir=$(outDir)
	cp $(assetDir) dist/ -r

.PHONY: clean
clean:
	find $(outDir) -type f -name \*.js | xargs rm 

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict
	rm -rf $(outDir)/$(assetDir)

