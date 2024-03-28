
srcDir        := src
outDir        := dist
outDirFirefox := dist/firefox
outDirChrome  := dist/chrome
assetDir      := assets
entryPoints   := $(shell find $(srcDir) -type f -name main-*)

.PHONY: build
build:
	npx esbuild $(entryPoints) --bundle --outdir=$(outDirFirefox)
	npx esbuild $(entryPoints) --bundle --outdir=$(outDirChrome)
	mkdir $(outDirFirefox) -p && cp $(assetDir) $(outDirFirefox)/ -r
	mkdir $(outDirChrome) -p && cp $(assetDir) $(outDirChrome)/ -r
	cp manifest-firefox.json $(outDirFirefox)/manifest.json
	cp manifest-chrome.json $(outDirChrome)/manifest.json

.PHONY: clean
clean:
	rm -rf $(outDir)

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict

