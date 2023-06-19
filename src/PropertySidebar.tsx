import { useRef, useState } from "react";
import { useArrayState } from "rooks";

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

export const PropertyPanel = () => {
    // stores idx of items in the right sidebar
    const [styleKey, setStyleKey] = useState<string>('display');
    const [styleValueIdx, styleValueIdxControls] = useArrayState<number>(Array(propertiesMeta.length).fill(0));
    // for scrolling into view
    const rightSidebarRef = useRef(null);

    let displayedKeys: Array<string> = [
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
        displayedKeys.push(spacingType);
    }

    let spacingDir = properties[spacingType][styleValueIdx[spacingTypeIdx]];
    if (spacingDir === 'top-bottom') {
        spacingDir = 'TopBot'
    } else if (spacingDir === 'left-right') {
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
        displayedKeys.push(`${spacingItem}${spacingDir}SpacingUnit`)
        displayedKeys.push(`${spacingItem}${spacingDir}SpacingAmt`)
    }

    displayedKeys.push('colorItem');

    const colorIdx = 33;
    const colorItem = properties.colorItem[styleValueIdx[colorIdx]];
    if (colorItem) {
        displayedKeys.push(`${colorItem}ColorA`)
        displayedKeys.push(`${colorItem}ColorH`)
        displayedKeys.push(`${colorItem}ColorS`)
        displayedKeys.push(`${colorItem}ColorL`)
    }

    const displayedKeys2Idx = new Map(displayedKeys.map((key, i) => [key, i]));

    const NextPropertyItem = () => {
        const curKeyIdx = displayedKeys2Idx.get(styleKey);
        const nextKeyIdx = ((curKeyIdx ? curKeyIdx : 0) + 1 + displayedKeys.length) % displayedKeys.length;
        const nextKey = displayedKeys[nextKeyIdx];
        setStyleKey(nextKey);
        // to calculate style we need the index of the properties array
        const retKeyIdx = properties2Idx.get(nextKey) || 0;
        const retValIdx = styleValueIdx[retKeyIdx];
        // scroll
        //@ts-ignore
        rightSidebarRef.current?.children[nextKeyIdx].scrollIntoView();
        return { retKeyIdx, retValIdx };
    }

    const PrevPropertyItem = () => {
        const curKeyIdx = displayedKeys2Idx.get(styleKey);
        const prevKeyIdx = ((curKeyIdx ? curKeyIdx : 0) - 1 + displayedKeys.length) % displayedKeys.length;
        const prevKey = displayedKeys[prevKeyIdx];
        setStyleKey(prevKey);
        // to calculate style we need the index of the properties array
        const retKeyIdx = properties2Idx.get(prevKey) || 0;
        const retValIdx = styleValueIdx[retKeyIdx];
        // scroll
        //@ts-ignore
        rightSidebarRef.current?.children[prevKeyIdx].scrollIntoView();
        return { retKeyIdx, retValIdx };
    }

    const NextPropertyValue = () => {
        let curKeyIdx = properties2Idx.get(styleKey);
        curKeyIdx = (curKeyIdx ? curKeyIdx : 0);
        const newValueIdx = (styleValueIdx[curKeyIdx] + 1 + propertiesMeta[curKeyIdx].length) % propertiesMeta[curKeyIdx].length;
        styleValueIdxControls.replaceItemAtIndex(curKeyIdx, newValueIdx);
        // to calculate style we need the index of the properties array
        return { retKeyIdx: curKeyIdx, retValIdx: newValueIdx };
    }

    const PrevPropertyValue = () => {
        let curKeyIdx = properties2Idx.get(styleKey);
        curKeyIdx = (curKeyIdx ? curKeyIdx : 0);
        const newValueIdx = (styleValueIdx[curKeyIdx] - 1 + propertiesMeta[curKeyIdx].length) % propertiesMeta[curKeyIdx].length;
        styleValueIdxControls.replaceItemAtIndex(curKeyIdx, newValueIdx);
        // to calculate style we need the index of the properties array
        return { retKeyIdx: curKeyIdx, retValIdx: newValueIdx };
    }

    return {
        NextPropertyItem,
        PrevPropertyItem,
        NextPropertyValue,
        PrevPropertyValue,
        rightSidebarRef,
        render: (
            <>
                {displayedKeys.map((key: string) => {
                    const i = properties2Idx.get(key) || 0;
                    return (
                        <div id='right-sidebar-item' key={i}>
                            <div className='sidebar-item-header'>
                                {key}
                            </div>
                            <div className='sidebar-item-content'>
                                {properties[key].map((value: any, j: number) =>
                                    <div
                                        key={j}
                                        style={{
                                            border: key === styleKey && j === styleValueIdx[i] ? '1px solid' : 'none',
                                            display: 'inline-flex',
                                            padding: '2px'
                                        }}>
                                        {value}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
                )}
            </>
        )
    }

}