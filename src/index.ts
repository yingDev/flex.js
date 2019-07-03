import FLEX from "./flex.asm"

export enum FlexAlign
{
	auto = 0,
	stretch,
	center,
	start,
	end,
	space_between,
	space_around,
	space_evenly
}

export enum FlexPosition
{
	relative = 0,
	absolute
}

export enum FlexDirection
{
	row = 0,
	row_reverse,
	column,
	column_reverse
}

export enum FlexWrap
{
	no_wrap = 0,
	wrap,
	wrap_reverse
}

function dirty():any
{

}

enum DirtyFlag
{
	Size=1, Location=2, Padding=4, Margin=8, Enums=16, Misc=32
}

export class Flex
{
	constructor() {}

	private _index = -1;
	private _item = FLEX.create();
	private _dirtyFlag = 0;

	width = NaN;
	height = NaN;

	left = NaN;
	right = NaN;
	top = NaN;
	bottom = NaN;

	padding_left = 0.0;
	padding_right = 0.0;
	padding_top = 0.0;
	padding_bottom = 0.0;

	margin_left = 0.0;
	margin_right = 0.0;
	margin_top = 0.0;
	margin_bottom = 0.0;

	justify_content: keyof typeof FlexAlign = "start";
	align_content: keyof typeof FlexAlign = "stretch";
	align_items: keyof typeof FlexAlign = "stretch";
	align_self: keyof typeof FlexAlign = "auto";
	position: keyof typeof FlexPosition = "relative";
	direction: keyof typeof FlexDirection = "column";
	wrap: keyof typeof FlexWrap = "no_wrap";

	grow = 0.0;
	shrink = 1.0;
	order = 0;
	basis = NaN;

	commit()
	{
		let d = this._dirtyFlag;
		if(d == 0)
			return;

		let {_item} = this;
		const {Size, Location, Padding, Margin, Enums, Misc} = DirtyFlag;

		(d & Size) && FLEX.set_size(_item, this.width, this.height);
		(d & Location) && FLEX.set_location(_item, this.top, this.right, this.bottom, this.left);
		(d & Padding) && FLEX.set_padding(_item, this.padding_top, this.padding_right, this.padding_bottom, this.padding_left);
		(d & Margin) && FLEX.set_margin(_item, this.margin_top, this.margin_right, this.margin_bottom, this.margin_left);
		(d & Enums) && FLEX.set_enum_props_batch(_item,
			FlexAlign[this.justify_content] << 0 |
			FlexAlign[this.align_content]   << 4 |
			FlexAlign[this.align_items]	    << 8 |
			FlexAlign[this.align_self]      << 12|
			FlexPosition[this.position]     << 16|
			FlexDirection[this.direction]   << 20|
			FlexWrap[this.wrap]  		    << 24
		);

		this._dirtyFlag = 0;

	}


	add(child: Flex)
	{
		this._checkDestroyed();
		this._index = FLEX.count();
		FLEX.add(this._item, child._item);
	}

	removeSelf()
	{
		this._checkDestroyed();
		if(this._index < 0)
			return;
		let parent = FLEX.parent(this._item);
		FLEX.delete(parent, this._index);
		this._index = -1;
	}

	set(value: Partial<Flex>)
	{
		this._checkDestroyed();
		Object.assign(this, value);
	}

	destroy()
	{
		this._checkDestroyed();
		if(this._index >= 0)
			throw "remove self first.";
		FLEX.free(this._item);
		this._item = null;
	}

	private _checkDestroyed()
	{
		if(this._item == null)
			throw "item has been destroyed";
	}
}