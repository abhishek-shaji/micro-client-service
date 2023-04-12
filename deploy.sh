#!/bin/bash

echo "Deleting ./dist directory"
rm -rf dist

echo "Copying src directory to dist directory"
cp -R src dist

echo "Renaming .lambda.ts files to .ts"
find ./dist/lambdas -name "*.lambda.ts" | while read fname; do mv "$fname" "${fname%.lambda.ts}.ts"; done

echo "Running serverless deploy..."
serverless deploy "$@"