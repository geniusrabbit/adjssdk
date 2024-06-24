COMMIT_NUMBER ?= $(or ${DEPLOY_COMMIT_NUMBER},)
ifeq (${COMMIT_NUMBER},)
	COMMIT_NUMBER = $(shell git log -1 --pretty=format:%h)
endif

TAG_VALUE ?= $(or ${DEPLOY_TAG_VALUE},)
ifeq (${TAG_VALUE},)
	TAG_VALUE = $(shell git describe --exact-match --tags `git log -n1 --pretty='%h'`)
endif
ifeq (${TAG_VALUE},)
	TAG_VALUE = commit-${COMMIT_NUMBER}
endif

PROJECT_WORKSPACE ?= adnet-project
PROJECT_NAME ?= jssdk
DOCKER_CONTAINER_IMAGE := ${PROJECT_WORKSPACE}/${PROJECT_NAME}
DOCKER_BUILDKIT ?= 1

.PHONY: build
build: ## Build the project
	npm run build

.PHONY: build-dev
build-dev: ## Build the project in development mode
	npm run build:dev

.PHONY: build-none
build-none: ## Build the project without minification
	npm run build:none

.PHONY: build-docker
build-docker: build-none ## Build the docker image
	@echo "Build docker image"
	DOCKER_BUILDKIT=${DOCKER_BUILDKIT} docker build \
		-t ${DOCKER_CONTAINER_IMAGE}:${TAG_VALUE} -t ${DOCKER_CONTAINER_IMAGE}:latest \
		-f deploy/production/Dockerfile .

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
