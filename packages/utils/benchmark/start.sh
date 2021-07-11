#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "usage: $0 <benchmark>"
  exit 1
fi

benchmark=$1

echo Starting benchmark "${benchmark##*/}"
echo
node --experimental-modules --max-old-space-size=12192 --es-module-specifier-resolution=node  "$benchmark"
echo
