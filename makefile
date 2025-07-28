BUILD_TAGS = "webkit2_41"
BINARY_NAME = api-mockup
UPXFLAGS = -1

.PHONY: default dev build serve clean doctor help

default: dev

dev:
	@wails dev -tags $(BUILD_TAGS)

build: clean build-linux build-win build-mac

build-linux:
	@echo "Building Linux..."
	GOOS=linux GOARCH=amd64 wails build \
	  -tags "$(BUILD_TAGS)" \
	  -ldflags "-s -w" \
	  -trimpath \
	  -o $(BINARY_NAME)-linux

	upx $(UPXFLAGS) build/bin/$(BINARY_NAME)-linux

build-win:
	@echo "Building Windows..."
	GOOS=windows GOARCH=amd64 wails build \
	  -tags "$(BUILD_TAGS)" \
	  -ldflags "-s -w" \
	  -trimpath \
	  -o $(BINARY_NAME).exe
	
	upx $(UPXFLAGS) build/bin/$(BINARY_NAME).exe

build-mac:
	@echo "Building macOS..."
	GOOS=darwin GOARCH=amd64 wails build \
	  -tags "$(BUILD_TAGS)" \
	  -ldflags "-s -w" \
	  -trimpath \
	  -o $(BINARY_NAME)-macos
	  
	upx $(UPXFLAGS) build/bin/$(BINARY_NAME)-macos

serve:
	@build/bin/$(BINARY_NAME)-linux

clean:
	@rm -rf build
	@rm -rf frontend/wailsjs

doctor:
	@wails doctor

help:

