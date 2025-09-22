export interface SVGBaseAttributes {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    transform?: string;
}
export interface SVGCircleAttributes extends SVGBaseAttributes {
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
}
export interface SVGRectAttributes extends SVGBaseAttributes {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    rx?: number | string;
    ry?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
}
export interface SVGGAttributes extends SVGBaseAttributes {
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
}
