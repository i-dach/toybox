# golangでlambda実装 (対応ver 1.x)
FROM golang:1.10.6-alpine

# 環境設定
## default settting
RUN apk update && apk upgrade
RUN apk add --no-cache bash git openssh
RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
      && pip install virtualenv \
      && rm -rf /var/cache/apk/*
RUN pip install --upgrade pip
    
## aws sam cli
RUN apk add nodejs
RUN pip install awscli
RUN pip install --user --upgrade aws-sam-cli

RUN USER_BASE_PATH=$(python -m site --user-base)
RUN export PATH=$PATH:$USER_BASE_PATH/bin
