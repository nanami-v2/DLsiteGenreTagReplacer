
srcDir      := src
outDir      := dist
assetDir    := assets
entryPoints := $(srcDir)/content-script.ts $(srcDir)/background-script.ts

srcFiles      := $(shell find $(srcDir) -type f) 
assertFiles   := $(shell find $(assetDir) -type f)
manifestFiles := manifest-chrome.json manifest-firefox.json

.PHONY: build
build: $(outDir)/chrome $(outDir)/firefox

.PHONY: clean
clean:
	rm -rf $(outDir)

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict

$(outDir)/%: $(srcFiles) $(assertFiles) $(manifestFiles)
	npx esbuild $(entryPoints) --bundle --outdir=$(outDir)/$*
	cp $(assetDir) $(outDir)/$*/ -r
	cp manifest-$*.json $(outDir)/$*/manifest.json
	touch $@