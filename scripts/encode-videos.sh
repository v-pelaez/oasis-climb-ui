#!/usr/bin/env bash
# Re-encodes the site videos to VP9/WebM (constant quality, two passes, yuv420p, same fps and duration).
# Usage: scripts/encode-videos.sh <originals-dir> [output-dir]
#   <originals-dir> holds the original aspira/construye/logra/aboutus .webm (they are not kept in the repo)
#   [output-dir] defaults to src/assets (replaces the files in place)
# Needs ffmpeg with libvpx-vp9 on PATH. Targets: hero videos <= 3 MB, aboutus <= 8 MB.
set -euo pipefail

in_dir=${1:?usage: encode-videos.sh <originals-dir> [output-dir]}
out_dir=${2:-"$(dirname "$0")/../src/assets"}
log="$(mktemp -d)/pass"
null=/dev/null
case "$(uname -s)" in MINGW* | MSYS* | CYGWIN*) null=NUL ;; esac

# encode <name> <crf> <scale filter> <extra input flags>
encode() {
  local name=$1 crf=$2 scale=$3 audio=$4
  local common=(-i "$in_dir/$name.webm" -vf "$scale,format=yuv420p" $audio
    -c:v libvpx-vp9 -crf "$crf" -b:v 0 -row-mt 1 -deadline good -cpu-used 1 -g 250)
  ffmpeg -v error -y "${common[@]}" -pass 1 -passlogfile "$log" -f null "$null"
  ffmpeg -v error -y "${common[@]}" -pass 2 -passlogfile "$log" -c:a libopus -b:a 64k "$out_dir/$name.webm"
}

# Hero videos: no audio (-an). aspira.webm does not fit 3 MB at 1080p with crf <= 38, so it is 720p.
encode aspira 35 scale=1280:720 -an
encode construye 34 scale=1920:1080 -an
encode logra 34 scale=1920:1080 -an
# About video keeps its audio track (Opus 64 kbps), 1080p. crf 34-36 gives 8.4-9.4 MB, over the 8 MB target.
encode aboutus 38 scale=1920:1080 ""
