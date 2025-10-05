---
id: upload-python-lambda
aliases: []
tags: []
datePosted: "2023-07-23"
dateUpdated: "2023-07-23"
---

# Deploying Python Scripts on AWS Lambda

**Disclaimer: Python 3.10 was used in this guide**

Having trouble deploying your Python scripts onto AWS Lambda? This guide covers how to do it via the following methods:
1. ZIP File
2. Docker Image

# Prerequisites

Before starting, ensure that you have the following installed

1. Python
2. Docker
3. An AWS account


# Gathering our dependencies

First we will need to create a `requirements.txt` file to track the dependencies and the versions that we have used.

```shell
pip freeze > requirements.txt
```

Now we will fetch the AWS Lambda environment from the Docker repository, you can check [the Docker repository](https://gallery.ecr.aws/lambda/python) if you are using another version of Python.

```shell
docker pull public.ecr.aws/lambda/python:3.10
```

Run the Docker AWS Linux 2 environment.

```shell
docker run --rm -it\
        --net=host \
        -v `pwd`:/home/mylambdaworkdir \
        --workdir /home/mylambdaworkdir \
        -e PYTHONPATH="/home/python"\
        python:3.10 bash  
```

Pull the python dependencies into a folder called `package`.

```shell
pip install -r requirements.txt --target package --platform manylinux2014_x86_64 --only-binary=:all:
```

Exit the Docker container with

```shell
exit
```

We need to make a zip package to deploy the python script to Lambda.

```shell
cd package
zip -r ../deployment_package.zip .
```

Add your lambda function to the file

```shell
cd ..
zip deployment_package lambda_function.py
```

Now you can upload the deployment package to Lambda!
