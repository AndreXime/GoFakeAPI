BUILD_TAGS = "webkit2_41"
BINARY_NAME = GoFakeAPI
BUILD_DIR = build/bin

.PHONY: default dev build serve clean doctor help

default: dev

dev:
	@wails dev -tags $(BUILD_TAGS)

build:
	GOOS=linux   GOARCH=amd64 wails build -tags $(BUILD_TAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-linux
	GOOS=windows GOARCH=amd64 wails build -tags $(BUILD_TAGS) -o $(BUILD_DIR)/$(BINARY_NAME).exe
	GOOS=darwin  GOARCH=amd64 wails build -tags $(BUILD_TAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-macos


serve:
	@$(BUILD_DIR)/$(BINARY_NAME)

clean:
	@rm -rf build
	@rm -rf frontend/wailsjs

doctor:
	@wails doctor

help:

