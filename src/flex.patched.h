// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See the LICENSE.txt file in the project root
// for the license information.

#ifndef __FLEX_H_
# define __FLEX_H_

#if defined(_WIN32) // Also works for WIN64.
# define DLLEXPORT __declspec(dllexport) 
# define WINAPI_STDCALL __stdcall
#else
# define DLLEXPORT
# define WINAPI_STDCALL
#endif

struct flex_item;

// Create a new flex item.
DLLEXPORT size_t flex_item_new(void);

// Free memory associated with a flex item and its children.
// This function can only be called on a root item.
DLLEXPORT void flex_item_free(size_t item);

// Manage items.
DLLEXPORT void flex_item_add(size_t item, size_t child);
DLLEXPORT void flex_item_insert(size_t item, unsigned int index,
        size_t child);
DLLEXPORT size_t flex_item_delete(size_t item,
		unsigned int index);
DLLEXPORT unsigned int flex_item_count(size_t item);
DLLEXPORT size_t flex_item_child(size_t item,
		unsigned int index);
DLLEXPORT size_t flex_item_parent(size_t item);
DLLEXPORT size_t flex_item_root(size_t item);

// Layout the items associated with this item, as well as their children.
// This function can only be called on a root item whose `width' and `height'
// properties have been set.
DLLEXPORT void flex_layout(size_t item);

// Retrieve the layout frame associated with an item. These functions should
// be called *after* the layout is done.
DLLEXPORT float flex_item_get_frame_x(size_t item);
DLLEXPORT float flex_item_get_frame_y(size_t item);
DLLEXPORT float flex_item_get_frame_width(size_t item);
DLLEXPORT float flex_item_get_frame_height(size_t item);

typedef enum {
    FLEX_ALIGN_AUTO = 0,
    FLEX_ALIGN_STRETCH,
    FLEX_ALIGN_CENTER,
    FLEX_ALIGN_START,
    FLEX_ALIGN_END,
    FLEX_ALIGN_SPACE_BETWEEN,
    FLEX_ALIGN_SPACE_AROUND,
    FLEX_ALIGN_SPACE_EVENLY
} flex_align;

typedef enum {
    FLEX_POSITION_RELATIVE = 0,
    FLEX_POSITION_ABSOLUTE
} flex_position;

typedef enum {
    FLEX_DIRECTION_ROW = 0,
    FLEX_DIRECTION_ROW_REVERSE,
    FLEX_DIRECTION_COLUMN,
    FLEX_DIRECTION_COLUMN_REVERSE
} flex_direction;

typedef enum {
    FLEX_WRAP_NO_WRAP = 0,
    FLEX_WRAP_WRAP,
    FLEX_WRAP_WRAP_REVERSE
} flex_wrap;

// size[0] == width, size[1] == height
typedef void (WINAPI_STDCALL *flex_self_sizing)(size_t item, float size[2]);

# ifndef FLEX_ATTRIBUTE
#  define FLEX_ATTRIBUTE(name, type, def) \
    DLLEXPORT type flex_item_get_##name(size_t item); \
    DLLEXPORT void flex_item_set_##name(size_t item, type value);
# endif

#else // !__FLEX_H_

# ifndef FLEX_ATTRIBUTE
#  define FLEX_ATTRIBUTE(name, type, def)
# endif

#endif

// Following are the list of properties associated with an item.
//
// Each property is exposed with getter and setter functions, for instance
// the `width' property can be get and set using the respective
// `flex_item_get_width()' and `flex_item_set_width()' functions.
//
// You can also see the type and default value for each property.

FLEX_ATTRIBUTE(width, float, NAN)
FLEX_ATTRIBUTE(height, float, NAN)

FLEX_ATTRIBUTE(left, float, NAN)
FLEX_ATTRIBUTE(right, float, NAN)
FLEX_ATTRIBUTE(top, float, NAN)
FLEX_ATTRIBUTE(bottom, float, NAN)

FLEX_ATTRIBUTE(padding_left, float, 0)
FLEX_ATTRIBUTE(padding_right, float, 0)
FLEX_ATTRIBUTE(padding_top, float, 0)
FLEX_ATTRIBUTE(padding_bottom, float, 0)

FLEX_ATTRIBUTE(margin_left, float, 0)
FLEX_ATTRIBUTE(margin_right, float, 0)
FLEX_ATTRIBUTE(margin_top, float, 0)
FLEX_ATTRIBUTE(margin_bottom, float, 0)

FLEX_ATTRIBUTE(justify_content,unsigned, FLEX_ALIGN_START)
FLEX_ATTRIBUTE(align_content,unsigned, FLEX_ALIGN_STRETCH)
FLEX_ATTRIBUTE(align_items,unsigned, FLEX_ALIGN_STRETCH)
FLEX_ATTRIBUTE(align_self,unsigned, FLEX_ALIGN_AUTO)

FLEX_ATTRIBUTE(position,unsigned, FLEX_POSITION_RELATIVE)
FLEX_ATTRIBUTE(direction,unsigned, FLEX_DIRECTION_COLUMN)
FLEX_ATTRIBUTE(wrap,unsigned, FLEX_WRAP_NO_WRAP)

FLEX_ATTRIBUTE(grow, float, 0.0)
FLEX_ATTRIBUTE(shrink, float, 1.0)
FLEX_ATTRIBUTE(order, int, 0)
FLEX_ATTRIBUTE(basis, float, NAN)

// An item can store an arbitrary pointer, which can be used by bindings as
// the address of a managed object.
FLEX_ATTRIBUTE(managed_ptr, void *, NULL)

// An item can provide a self_sizing callback function that will be called
// during layout and which can customize the dimensions (width and height)
// of the item.
FLEX_ATTRIBUTE(self_sizing, flex_self_sizing, NULL)

#undef FLEX_ATTRIBUTE
