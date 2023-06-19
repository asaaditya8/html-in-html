
function Range(start: number, step: number, count: number) {
    return Array(count).fill(start).map((x, y) => (x + y * step).toFixed(1))
}

function spacing() {
    return Range(0.2, 0.8, 12)
}

function hue() {
    return Range(0, 30, 12);
}

function saturation_lightness() {
    return Range(0, 10, 11);
}

function alpha() {
    return Range(0, 0.1, 11);
}

function spacing_unit() {
    return ['px', 'em', 'rem', 'cm', 'vh', 'vw', 'vd', 'vi']
}

export const properties: any = {
    borderStyle: ['transparent', 'solid', 'dashed', 'dotted'],
    borderR: saturation_lightness(),
    alignItems: ['center', 'left', 'right'],
    display: ['flex', 'inline-flex', 'grid', 'inline-grid', 'block', 'inline-block', 'flow-root'],
    justifyItems: ['center', 'left', 'right'],
    textAlign: ['center', 'left', 'right'],
    spacing: ['margin', 'padding'],
    marginSpacingItem: ['top-bottom', 'left-right', 'top', 'right', 'bottom', 'left'],
    paddingSpacingItem: ['top-bottom', 'left-right', 'top', 'right', 'bottom', 'left'],
    marginTopBotSpacingUnit: spacing_unit(),
    marginTopBotSpacingAmt: spacing(),
    marginLeftRiSpacingUnit: spacing_unit(),
    marginLeftRiSpacingAmt: spacing(),
    marginTopSpacingUnit: spacing_unit(),
    marginTopSpacingAmt: spacing(),
    marginRightSpacingUnit: spacing_unit(),
    marginRightSpacingAmt: spacing(),
    marginBottomSpacingUnit: spacing_unit(),
    marginBottomSpacingAmt: spacing(),
    marginLeftSpacingUnit: spacing_unit(),
    marginLeftSpacingAmt: spacing(),
    paddingTopBotSpacingUnit: spacing_unit(),
    paddingTopBotSpacingAmt: spacing(),
    paddingLeftRiSpacingUnit: spacing_unit(),
    paddingLeftRiSpacingAmt: spacing(),
    paddingTopSpacingUnit: spacing_unit(),
    paddingTopSpacingAmt: spacing(),
    paddingRightSpacingUnit: spacing_unit(),
    paddingRightSpacingAmt: spacing(),
    paddingBottomSpacingUnit: spacing_unit(),
    paddingBottomSpacingAmt: spacing(),
    paddingLeftSpacingUnit: spacing_unit(),
    paddingLeftSpacingAmt: spacing(),
    colorItem: ['bg', 'fg', 'border'],
    bgColorA: alpha(),
    bgColorH: hue(),
    bgColorS: saturation_lightness(),
    bgColorL: saturation_lightness(),
    fgColorA: alpha(),
    fgColorH: hue(),
    fgColorS: saturation_lightness(),
    fgColorL: saturation_lightness(),
    borderColorA: alpha(),
    borderColorH: hue(),
    borderColorS: saturation_lightness(),
    borderColorL: saturation_lightness(),
};

export const properties2Idx = new Map(Object.keys(properties).map((key, i) => [key, i]));

export const propertiesMeta = Object.keys(properties).map((key) => {
    const obj = {
        item: key,
        idx: 0,
        length: properties[key].length,
    }
    return obj;
});

export const PropertyPanel = (props: any) => {
    const { styleIdx, styleValueIdx } = props;

    let finalKeys: Array<string> = [
        'borderStyle',
        'borderR',
        'alignItems',
        'display',
        'justifyItems',
        'textAlign',
        'spacing',
    ];

    const spacingIdx = 6;
    const spacingItem = properties.spacing[styleValueIdx[spacingIdx]];
    let spacingType = '';
    let spacingTypeIdx = 0;
    if (spacingItem === 'margin') {
        spacingType = 'marginSpacingItem';
        spacingTypeIdx = 7;
    } else if (spacingItem === 'padding') {
        spacingType = 'paddingSpacingItem';
        spacingTypeIdx = 8;
    }

    if (spacingType) {
        finalKeys.push(spacingType);
    }

    let spacingDir = properties[spacingType][styleValueIdx[spacingTypeIdx]];
    if (spacingDir === 'top-bottom' ) {
        spacingDir = 'TopBot'
    } else if (spacingDir === 'left-right' ) {
        spacingDir = 'LeftRi'
    } else if (spacingDir === 'top') {
        spacingDir = 'Top'
    } else if (spacingDir === 'left') {
        spacingDir = 'Left'
    } else if (spacingDir === 'right') {
        spacingDir = 'Right'
    } else if (spacingDir === 'bottom') {
        spacingDir = 'Bottom'
    }

    if (spacingDir) {
        finalKeys.push(`${spacingItem}${spacingDir}SpacingUnit`)
        finalKeys.push(`${spacingItem}${spacingDir}SpacingAmt`)
    }

    finalKeys.push('colorItem');
    
    const colorIdx = 33;
    const colorItem = properties.colorItem[styleValueIdx[colorIdx]];
    if (colorItem) {
        finalKeys.push(`${colorItem}ColorA`)
        finalKeys.push(`${colorItem}ColorH`)
        finalKeys.push(`${colorItem}ColorS`)
        finalKeys.push(`${colorItem}ColorL`)
    }
    
    const NextPropertyItem = () => {
        
    }

    return (
    <>
        {Object.keys(properties).map((key, i) => [key, i]).filter(param => finalKeys.includes(param[0])).map(([key ,i], _) =>
            <div id='right-sidebar-item' key={i}>
                <div className='sidebar-item-header'>
                    {key}
                </div>
                <div className='sidebar-item-content'>
                    {properties[key].map((value: any, j: number) =>
                        <div
                            key={j}
                            style={{
                                border: i === styleIdx && j === styleValueIdx[i] ? '1px solid' : 'none',
                                display: 'inline-flex',
                                padding: '2px'
                            }}>
                            {value}
                        </div>
                    )}
                </div>
            </div>
        )}
    </>
    )

}