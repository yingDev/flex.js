#!/usr/bin/env bash
mkdir -p dist

sed -e 's/struct flex_item \*/size_t /g; s/, flex_align,/,unsigned,/g; s/, flex_position,/,unsigned,/g; s/, flex_direction,/,unsigned,/g; s/, flex_wrap,/,unsigned,/g' flex/flex.h > src/flex.patched.h

emcc src/bindings.cpp flex/flex.c \
	-o src/flex.asm.js -DCXX_STANDARD=14 --bind \
	-O3 --closure 1 -flto=full -fno-rtti --llvm-lto 3 \
	--memory-init-file 0 -s WASM=0  -s STRICT=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME=FLEXJS -s MODULARIZE_INSTANCE=1 \
	-s ENVIRONMENT=web -s FILESYSTEM=0 -s NO_EXIT_RUNTIME=1  -s USE_PTHREADS=0 -s ELIMINATE_DUPLICATE_FUNCTIONS=1 \
	-DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=0
