#
# SPLS88 Makefile
#
ifeq ($(IMG_TAG),)
	WUI_IMG_TAG:=FE-$(shell git --git-dir=./.git rev-parse HEAD | cut -b 1-4)
else
	WUI_IMG_TAG:=$(IMG_TAG)
endif
ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

DOCKER_ADDR="registry.digitalocean.com/onelinesoft"

build-and-push-drtng: build-and-push-drtng-web

build-and-push-drtng-web: build-drtng-web push-drtng-web

build-drtng-web:
	docker build -f Dockerfile -t "$(DOCKER_ADDR)/drtng-web:$(WUI_IMG_TAG)" .

push-drtng-web:
	docker push "$(DOCKER_ADDR)/drtng-web:$(WUI_IMG_TAG)"
