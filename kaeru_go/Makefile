.PHONY: deps clean build

all: deps clean build

deps:
#	go get -u ./...
	go get -u github.com/aws/aws-lambda-go/events
	go get -u github.com/aws/aws-lambda-go/lambda

clean: 
	rm -rf ./hello-world/hello-world
	
build:
	GOOS=linux GOARCH=amd64 go build -o hello-world/hello-world ./hello-world
