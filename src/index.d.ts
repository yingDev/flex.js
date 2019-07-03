export declare enum FlexAlign {
    auto = 0,
    stretch = 1,
    center = 2,
    start = 3,
    end = 4,
    space_between = 5,
    space_around = 6,
    space_evenly = 7
}
export declare enum FlexPosition {
    relative = 0,
    absolute = 1
}
export declare enum FlexDirection {
    row = 0,
    row_reverse = 1,
    column = 2,
    column_reverse = 3
}
export declare enum FlexWrap {
    no_wrap = 0,
    wrap = 1,
    wrap_reverse = 2
}
export declare class FlexItem {
    private _index;
    private _item;
    private _dirtyFlag;
    private _children;
    private _parent;
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    padding_left: number;
    padding_right: number;
    padding_top: number;
    padding_bottom: number;
    margin_left: number;
    margin_right: number;
    margin_top: number;
    margin_bottom: number;
    justify_content: keyof typeof FlexAlign;
    align_content: keyof typeof FlexAlign;
    align_items: keyof typeof FlexAlign;
    align_self: keyof typeof FlexAlign;
    position: keyof typeof FlexPosition;
    direction: keyof typeof FlexDirection;
    wrap: keyof typeof FlexWrap;
    grow: number;
    shrink: number;
    order: number;
    basis: number;
    readonly parent: FlexItem;
    readonly index: number;
    readonly childCount: number;
    readonly frameX: number;
    readonly frameY: number;
    readonly frameWidth: number;
    readonly frameHeight: number;
    constructor();
    commitProps(): void;
    add(child: FlexItem): void;
    insert(child: FlexItem, index: number): void;
    remove(child: FlexItem): void;
    layout(): void;
    destroy(): void;
    private _setDestroyed;
    private _checkDestroyed;
}
