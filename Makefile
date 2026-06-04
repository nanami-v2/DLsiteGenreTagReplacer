
srcDir      := src
outDir      := dist
assetDir    := assets
entryPoints := $(srcDir)/content-script.ts $(srcDir)/background-script.ts
srcFiles    := $(shell find $(srcDir) -type f) 
assertFiles := $(shell find $(assetDir) -type f)

.PHONY: build
build: $(outDir)/chrome $(outDir)/firefox

.PHONY: zip
zip: $(outDir)/chrome.zip $(outDir)/firefox.zip

.PHONY: clean
clean:
	rm -rf $(outDir)

.PHONY: check
check:
	npx tsc $(srcDir)/*.ts --noEmit --strict


$(outDir)/%: $(srcFiles) $(assertFiles) manifest-%.json
	npx esbuild $(entryPoints) --bundle --outdir=$@
	cp -r $(assetDir)/* $@
	cp manifest-$*.json $@/manifest.json
	cp LICENSE $@/
	touch $@

$(outDir)/%.zip: $(outDir)/%
	cd $< && zip -r ../$*.zip .