
srcDir      := src
outDir      := dist
entryPoints := $(addprefix $(srcDir)/,main-background.ts main-contents.ts)

.PHONY: build
build:
	npx esbuild $(entryPoints) --bundle --outdir=$(outDir)

.PHONY: clean
clean:
	find $(outDir) -type f -name \*.js | xargs rm 

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict

