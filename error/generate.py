#!/usr/bin/python

# error codes source: https://github.com/MattIPv4/status-codes

import requests
import shutil
import json
import sys
import os

targetFolder = "dist/"
variants = ["gradient", "space", "light"]

variant = variants[0]
for argument in sys.argv:
    if argument in variants:
        variant = argument

def createFile(error, errorCode):
    fileName = targetFolder + errorCode + ".html"
    shutil.copy("templates/" + variant + ".html", fileName)

    filedata = None
    with open(fileName, "r") as f:
        filedata = f.read()

    filedata = filedata.replace("$ErrorCode", errorCode)
    filedata = filedata.replace("$ErrorName", error["message"])
    filedata = filedata.replace("$ErrorDescription", error["description"])

    with open(fileName, "w") as f:
        f.write(filedata)

# json = requests.get("https://status.js.org/codes.json").json()
errors = None
with open("errors.json") as f:
    errors = json.load(f)

if not os.path.exists(targetFolder):
    os.mkdir(targetFolder)

if os.path.exists(targetFolder + "assets"):
    shutil.rmtree(targetFolder + "assets")
shutil.copytree("assets", targetFolder + "assets")

for errorCode in errors.keys():
    if int(errorCode) >= 400:
        createFile(errors[errorCode], errorCode)
