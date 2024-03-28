
srcDir      := src
outDir      := dist
assetDir    := assets
entryPoints := $(shell find $(srcDir) -type f -name main-*)

.PHONY: build
build:
	npx esbuild $(entryPoints) --bundle --outdir=$(outDir)
	cp $(assetDir) $(outDir)/ -r
	cp manifest.json $(outDir)

.PHONY: clean
clean:
	rm -rf $(outDir)/*

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict

