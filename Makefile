
srcDir        := src
outDir        := dist
assetDir      := assets
entryPoints   := $(srcDir)/content-script.ts $(srcDir)/background-script.ts
srcFiles      := $(shell find $(srcDir) -type f) 
assertFiles   := $(shell find $(assetDir) -type f)
manifestFiles := $(shell find -maxdepth 1 -type f -name manifest-\*)

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


$(outDir)/%: $(srcFiles) $(assertFiles) $(manifestFiles)
	npx esbuild $(entryPoints) --bundle --outdir=$@
	mkdir -p $@/icons
	mkdir -p $@/genre-word-conversion-map
	find $(assetDir) -type f | grep 'i18n' | sed -e 's!$(assetDir)/i18n-messages-\(.*\)\.json!$@/_locales/\1!g' | xargs mkdir -p 
	find $(assetDir) -type f | grep 'i18n' | sed -e 'p;s!$(assetDir)/i18n-messages-\(.*\)\.json!$@/_locales/\1/messages\.json!g' | xargs -n2 cp
	find $(assetDir) -type f | grep 'icon' | sed -e 'p;s!$(assetDir)/icon-\(.*\)!$@/icons/\1!g' | xargs -n2 cp
	find $(assetDir) -type f | grep 'map'  | sed -e 'p;s!$(assetDir)/genre-word-conversion-map-\(.*\)!$@/genre-word-conversion-map/\1!g' | xargs -n2 cp
	cp manifest-$*.json $@/manifest.json
	cp LICENSE $@/
	touch $@

$(outDir)/%.zip: $(outDir)/%
	cd $< && zip -r ../$*.zip .