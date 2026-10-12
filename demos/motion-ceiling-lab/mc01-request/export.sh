#!/bin/sh
# Rebuild everything that is generated: data, keyframes, film, pipeline checks, variant keyframes, strips, browser checks.
# Run from the repository root: sh demos/motion-ceiling-lab/mc01-request/export.sh
set -e
W=demos/motion-ceiling-lab/mc01-request
P=demos/visual-grammar/_pipeline/vgpipe.py
node $W/build.mjs --all
rm -rf $W/renders/keyframes/*.png $W/variants/*/renders/keyframes/*.png
python3 $P frames $W > /dev/null
python3 $P render $W
python3 $P check $W
python3 $P frames $W/variants/long-labels 36.6 67.5 85 93 > /dev/null
python3 $P frames $W/variants/double-click 5 11.5 22 31 > /dev/null
python3 $P frames $W/variants/storage-from-behind 43 49 > /dev/null
python3 $W/strips.py
python3 $W/verify.py
