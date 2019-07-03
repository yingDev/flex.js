#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

extern "C"
{
    #include "./flex.patched.h"
}

using namespace emscripten;

void flex_item_set_enum_props_batch(size_t item, unsigned value)
{
	flex_item_set_justify_content(item,(value >> 0)  & 0xF);
	flex_item_set_align_content(item,  (value >> 4)  & 0xF);
	flex_item_set_align_items(item,    (value >> 8)  & 0xF);
	flex_item_set_align_self(item,     (value >> 12) & 0xF);
	flex_item_set_position(item,       (value >> 16) & 0xF);
	flex_item_set_direction(item,      (value >> 20) & 0xF);
	flex_item_set_wrap(item,           (value >> 24) & 0xF);
}

void flex_item_set_location(size_t item, float top, float right, float bottom, float left)
{
	flex_item_set_top(item, top);
	flex_item_set_right(item, right);
	flex_item_set_bottom(item, bottom);
	flex_item_set_left(item, left);
}

void flex_item_set_size(size_t item, float width, float height)
{
	flex_item_set_width(item, width);
	flex_item_set_height(item, height);
}

void flex_item_set_margin(size_t item, float top, float right, float bottom, float left)
{
	flex_item_set_margin_top(item, top);
	flex_item_set_margin_right(item, right);
	flex_item_set_margin_bottom(item, bottom);
	flex_item_set_margin_left(item, left);
}

void flex_item_set_uni_margin(size_t item, float value)
{
	flex_item_set_margin_top(item, value);
    flex_item_set_margin_right(item, value);
    flex_item_set_margin_bottom(item, value);
    flex_item_set_margin_left(item, value);
}

void flex_item_set_padding(size_t item, float top, float right, float bottom, float left)
{
	flex_item_set_padding_top(item, top);
	flex_item_set_padding_right(item, right);
	flex_item_set_padding_bottom(item, bottom);
	flex_item_set_padding_left(item, left);
}

void flex_item_set_uni_padding(size_t item, float value)
{
	flex_item_set_padding_top(item, value);
    flex_item_set_padding_right(item, value);
    flex_item_set_padding_bottom(item, value);
    flex_item_set_padding_left(item, value);
}

void flex_item_set_misc(size_t item, float grow, float shrink, int order, float basis)
{
	flex_item_set_grow(item, grow);
    flex_item_set_shrink(item, shrink);
    flex_item_set_order(item, order);
    flex_item_set_basis(item, basis);
}


#define BIND_FLEX_ATTRIBUTE(name) \
    function("get_"#name, &flex_item_get_##name); \
    function("set_"#name, &flex_item_set_##name);

EMSCRIPTEN_BINDINGS(_)
{
	function("create", &flex_item_new);
	function("free", &flex_item_free);
	function("add", &flex_item_add);
	function("insert", &flex_item_insert);
	function("remove", &flex_item_delete);
	function("count", &flex_item_count);
	function("child", &flex_item_child);
	function("parent", &flex_item_parent);
	function("root", &flex_item_root);
	function("layout", &flex_layout);
	function("get_frame_x", &flex_item_get_frame_x);
	function("get_frame_y", &flex_item_get_frame_y);
	function("get_frame_width", &flex_item_get_frame_width);
	function("get_frame_height", &flex_item_get_frame_height);

	function("set_enum_props_batch", &flex_item_set_enum_props_batch);
	function("set_location", &flex_item_set_location);
	function("set_size", &flex_item_set_size);
	function("set_margin", &flex_item_set_margin);
	function("set_padding", &flex_item_set_padding);
	function("set_uni_margin", &flex_item_set_uni_margin);
	function("set_uni_padding", &flex_item_set_uni_padding);
	function("set_misc", &flex_item_set_misc);

	BIND_FLEX_ATTRIBUTE(width)
    BIND_FLEX_ATTRIBUTE(height)

    BIND_FLEX_ATTRIBUTE(left)
    BIND_FLEX_ATTRIBUTE(right)
    BIND_FLEX_ATTRIBUTE(top)
    BIND_FLEX_ATTRIBUTE(bottom)

    BIND_FLEX_ATTRIBUTE(padding_left)
    BIND_FLEX_ATTRIBUTE(padding_right)
    BIND_FLEX_ATTRIBUTE(padding_top)
    BIND_FLEX_ATTRIBUTE(padding_bottom)

    BIND_FLEX_ATTRIBUTE(margin_left)
    BIND_FLEX_ATTRIBUTE(margin_right)
    BIND_FLEX_ATTRIBUTE(margin_top)
    BIND_FLEX_ATTRIBUTE(margin_bottom)

    BIND_FLEX_ATTRIBUTE(justify_content)
    BIND_FLEX_ATTRIBUTE(align_content)
    BIND_FLEX_ATTRIBUTE(align_items)
    BIND_FLEX_ATTRIBUTE(align_self)

    BIND_FLEX_ATTRIBUTE(position)
    BIND_FLEX_ATTRIBUTE(direction)
    BIND_FLEX_ATTRIBUTE(wrap)

    BIND_FLEX_ATTRIBUTE(grow)
    BIND_FLEX_ATTRIBUTE(shrink)
    BIND_FLEX_ATTRIBUTE(order)
    BIND_FLEX_ATTRIBUTE(basis)

}
