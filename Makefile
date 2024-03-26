
srcDir := src
outDir := dist
entryPoints := $(addprefix $(srcDir)/,main-background.ts main-contents.ts)

.PHONY: build
build:
#	npx tsc --noEmit
	npx esbuild $(entryPoints) --bundle --outdir=$(outDir)
#	npx tsc --build

.PHONY: rebuild
rebuild:
	@(MAKE) -f $(first $(MAKEFILE_LIST)) clean
	@(MAKE) -f $(first $(MAKEFILE_LIST)) build

.PHONY: clean
clean:
	find $(outDir) -type f -name \*.js | xargs rm 



