
srcDir        := src
outDirFirefox := dist-firefox
outDirChrome  := dist-chrome
assetDir      := assets
entryPoints   := $(shell find $(srcDir) -type f -name main-*)

.PHONY: build
build:
	npx esbuild $(entryPoints) --bundle --outdir=$(outDirFirefox)
	npx esbuild $(entryPoints) --bundle --outdir=$(outDirChrome)
	cp $(assetDir) $(outDirFirefox)/ -r
	cp $(assetDir) $(outDirChrome)/ -r
	cp manifest.json.firefox $(outDirFirefox)/manifest.json
	cp manifest.json.chrome $(outDirChrome)/manifest.json

.PHONY: clean
clean:
	rm -rf $(outDirFirefox)/*
	rm -rf $(outDirChrome)/*

.PHONY: check-type
check-type:
	npx tsc $(srcDir)/*.ts --noEmit --strict

