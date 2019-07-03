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
		get: function() { return this[field]; },
		set: function(value)
		{
			if(this[field] === value)
				return;
			this[field] = value;
			this._dirtyFlag |= flag;
		}
	}
};

export class FlexItem
{
	private _index = -1;
	private _item = FLEX.create();
	private _dirtyFlag = 0;
	private _children: Array<FlexItem> = [];
	private _parent: FlexItem = null;

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

	@dirty("Enums") justify_content: FlexAlign = FlexAlign.start;
	@dirty("Enums") align_content: FlexAlign = FlexAlign.stretch;
	@dirty("Enums") align_items: FlexAlign = FlexAlign.stretch;
	@dirty("Enums") align_self: FlexAlign = FlexAlign.auto;
	@dirty("Enums") position: FlexPosition = FlexPosition.relative;
	@dirty("Enums") direction: FlexDirection = FlexDirection.column;
	@dirty("Enums") wrap: FlexWrap = FlexWrap.no_wrap;

	@dirty("Misc") grow = 0.0;
	@dirty("Misc") shrink = 1.0;
	@dirty("Misc") order = 0;
	@dirty("Misc") basis = NaN;

	get parent() { return this._parent; }
	get index() { return this._index; }
	get childCount() { return this._children.length; }

	get frameX():number { return FLEX.get_frame_x(this._item); }
	get frameY():number { return FLEX.get_frame_y(this._item); }
	get frameWidth():number { return FLEX.get_frame_width(this._item); }
	get frameHeight():number { return FLEX.get_frame_height(this._item); }

	constructor()
	{
		this._dirtyFlag = 0;
	}

	commitProps()
	{
		let d = this._dirtyFlag;
		if(d == 0)
			return;

		let {_item} = this;
		const {Size, Location, Padding, Margin, Enums, Misc} = DirtyFlag;
		let m = <any>this;

		(d & Size) && FLEX.set_size(_item, this.width, this.height);
		(d & Location) && FLEX.set_location(_item, this.top, this.right, this.bottom, this.left);
		(d & Padding) && FLEX.set_padding(_item, this.padding_top, this.padding_right, this.padding_bottom, this.padding_left);
		(d & Margin) && FLEX.set_margin(_item, this.margin_top, this.margin_right, this.margin_bottom, this.margin_left);
		(d & Enums) && FLEX.set_enum_props_batch(_item,
			this.justify_content << 0 |
			this.align_content   << 4 |
			this.align_items	 << 8 |
			this.align_self      << 12|
			this.position        << 16|
			this.direction       << 20|
			this.wrap  		     << 24
		);
		(d & Misc) && FLEX.set_misc(m._grow, m._shrink, m._order, m._basis);

		this._dirtyFlag = 0;
	}

	add(child: FlexItem)
	{
		this._checkDestroyed();
		child._checkDestroyed();
		if(child._parent)
			throw "this item is other item's child.";

		child._index = this._children.length;// FLEX.count(this._item);
		child._parent = this;
		this._children.push(child);
		FLEX.add(this._item, child._item);
	}

	insert(child: FlexItem, index:number)
	{
		this._checkDestroyed();
		child._checkDestroyed();
		if(child._parent)
			throw "this item is other item's child.";
		let children = this._children;
		let len = children.length;
		if(index < 0 || index > len)
			throw "index out of range";

		child._index = index;
		child._parent = this;

		children.push(null);

		for(let i=len; i>index; i--)
			children[i] = children[i-1];
		children[index] = child;

		FLEX.insert(this._item, child._item, index);
	}

	remove(child: FlexItem)
	{
		this._checkDestroyed();
		child._checkDestroyed();
		if(child._parent !== this)
			throw "not a child";

		let arr = this._children;
		let index = child._index;

		for(let i=index, len = arr.length; i<len; i++)
			(arr[i] = arr[i+1])._index -= 1;
		child._parent = null;
		child._index = -1;

		FLEX.remove(this._item, index);
	}

	layout()
	{
		this._checkDestroyed();
		this.commitProps();
		FLEX.layout(this._item);
	}

	destroy()
	{
		this._checkDestroyed();
		if(this._parent)
			throw "only root item can be destroyed";
		FLEX.free(this._item);
		this._setDestroyed();
	}

	private _setDestroyed()
	{
		let children = this._children;

		this._dirtyFlag = 0;
		this._parent = null;
		this._children = null;
		this._index = -1;
		this._item = null;

		for(let i=0; i<children.length; i++)
			children[i]._setDestroyed();
	}

	private _checkDestroyed()
	{
		if(this._item == null)
			throw "item has been destroyed";
	}
}




let btn = document.getElementById("shit");
btn.addEventListener("click",()=>
{
	let a = new FlexItem();
	let child = new FlexItem();
	child.width = 100;
	child.height = 100;
	child.commitProps();
	a.add(child);

	a.justify_content = FlexAlign.center;
	a.align_items = FlexAlign.center;
	a.width = 123;
	a.height = 456;
	a.layout();

	console.log(child.frameX);
	console.log(child.frameY);
});