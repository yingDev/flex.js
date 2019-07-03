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



enum DirtyFlag
{
	Size=1, Location=2, Padding=4, Margin=8, Enums=16, Misc=32
}

const dirty = (type:keyof typeof DirtyFlag):any => (target, prop, desc) =>
{
	const field = '_'+prop;
	const flag = DirtyFlag[type];
	return {
		get() { return this[field]; },
		set(value)
		{
			if(this[field] === value)
				return;
			this[field] = value;
			this._inited && (this._dirtyFlag &= flag);
		}
	}
};

export class FlexItem
{
	private _inited = false;
	private _index = -1;
	private _item = FLEX.create();
	private _dirtyFlag = 0;

	@dirty("Size") width = NaN;
	@dirty("Size") height = NaN;

	@dirty("Location") left = NaN;
	@dirty("Location") right = NaN;
	@dirty("Location") top = NaN;
	@dirty("Location") bottom = NaN;

	@dirty("Padding") padding_left = 0.0;
	@dirty("Padding") padding_right = 0.0;
	@dirty("Padding") padding_top = 0.0;
	@dirty("Padding") padding_bottom = 0.0;

	@dirty("Margin") margin_left = 0.0;
	@dirty("Margin") margin_right = 0.0;
	@dirty("Margin") margin_top = 0.0;
	@dirty("Margin") margin_bottom = 0.0;

	@dirty("Enums") justify_content: keyof typeof FlexAlign = "start";
	@dirty("Enums") align_content: keyof typeof FlexAlign = "stretch";
	@dirty("Enums") align_items: keyof typeof FlexAlign = "stretch";
	@dirty("Enums") align_self: keyof typeof FlexAlign = "auto";
	@dirty("Enums") position: keyof typeof FlexPosition = "relative";
	@dirty("Enums") direction: keyof typeof FlexDirection = "column";
	@dirty("Enums") wrap: keyof typeof FlexWrap = "no_wrap";

	@dirty("Misc") grow = 0.0;
	@dirty("Misc") shrink = 1.0;
	@dirty("Misc") order = 0;
	@dirty("Misc") basis = NaN;

	constructor()
	{
		this._inited = true;
	}

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
		(d & Misc) && FLEX.set_misc(this.grow, this.shrink, this.order, this.basis);

		this._dirtyFlag = 0;
	}


	add(child: FlexItem)
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

	set(value: Partial<FlexItem>)
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