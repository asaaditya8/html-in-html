import { MutableRefObject } from "react";
import { addParent, cloneElement, styleCursorAt } from "./content/utils";
import { propertiesMeta } from "./PropertySidebar";

type CursorFocused = MutableRefObject<boolean>;
type SetCursorFocused = (value: boolean) => void;
type SetCursorAt = (id: string) => void;
type SetStyleIdx = (value: number) => void;
type UpdateCursorAt = (id: string) => void;
type Register = MutableRefObject<(Element | null)[]>;
  type UpdateMode = (mode: string) => void;
  type StyleValueIdxControls = any;

type Props = {
    cursorFocused: CursorFocused,
    setCursorFocused: SetCursorFocused,
    cursorAt: string,
    setCursorAt: SetCursorAt,
    updateCursorAt: UpdateCursorAt,
    styleIdx: number,
    setStyleIdx: SetStyleIdx,
    styleValueIdx: number[],
    cursorIn: string,
    setCursorIn: (value: string) => void,
    register: Register,
    updateMode: UpdateMode,
    styleValueIdxControls: StyleValueIdxControls,
};

export const onKeyDownBody = (event: any, props: Props) => {
    const {
        cursorFocused,
        setCursorFocused,
        cursorAt,
        setCursorAt,
        updateCursorAt,
        styleIdx,
        setStyleIdx,
        styleValueIdx,
        cursorIn,
        setCursorIn,
        register,
        updateMode,
        styleValueIdxControls
    } = props;
    // event.preventDefault();
    if (!cursorFocused.current) {
        const key = event.code;
        if (key === 'KeyA' && cursorAt) {
            const id: string | undefined = document.getElementById(cursorAt)?.parentElement?.id;
            if (id && id != 'content-wrapper') {
                updateCursorAt(id);
            }

        }
        if (key === 'KeyJ' && cursorAt) {
            event.preventDefault();
            // setCurrFocused(id);
            if (cursorIn === 'right-sidebar') {
                const newIdx = (styleIdx + 1) % propertiesMeta.length;
                setStyleIdx(newIdx);
                // @ts-ignore
                rightSidebarRef.current?.children[newIdx].scrollIntoView();

                styleCursorAt(newIdx, styleValueIdx[newIdx], cursorAt);
            } else {

                const ele = document.getElementById(cursorAt)?.nextElementSibling;
                ele?.scrollIntoView();
                const id: string | undefined = ele?.id;
                if (id) {
                    updateCursorAt(id);
                }
            }
        }
        if (key === 'KeyK' && cursorAt) {
            event.preventDefault();
            if (cursorIn === 'right-sidebar') {
                const newIdx = (styleIdx - 1 + propertiesMeta.length) % propertiesMeta.length;
                setStyleIdx(newIdx);
                // @ts-ignore
                rightSidebarRef.current?.children[newIdx].scrollIntoView();

                styleCursorAt(newIdx, styleValueIdx[newIdx], cursorAt);
            } else {
                const ele = document.getElementById(cursorAt)?.previousElementSibling;
                ele?.scrollIntoView();
                const id: string | undefined = ele?.id;
                if (id) {
                    updateCursorAt(id);
                }
            }
        }
        if (key === 'KeyH' && cursorAt) {
            event.preventDefault();
            if (cursorIn === 'right-sidebar') {
                const newIdx = (styleValueIdx[styleIdx] - 1 + propertiesMeta[styleIdx].length) % propertiesMeta[styleIdx].length;
                styleValueIdxControls.replaceItemAtIndex(styleIdx, newIdx);
                styleCursorAt(styleIdx, newIdx, cursorAt);
            }
        }
        if (key === 'KeyL' && cursorAt) {
            event.preventDefault();
            if (cursorIn === 'right-sidebar') {
                const newIdx = (styleValueIdx[styleIdx] + 1) % propertiesMeta[styleIdx].length;
                styleValueIdxControls.replaceItemAtIndex(styleIdx, newIdx);
                styleCursorAt(styleIdx, newIdx, cursorAt);
            }
        }
        if (key === 'KeyC' && cursorAt) {
            event.preventDefault();
            // const ele = document.getElementById(cursorAt);
            if (cursorIn === 'content-wrapper') {

                setCursorIn('right-sidebar');
                // ele.style.display = updateDisplay(ele.style.display);
            } else {
                setCursorIn('content-wrapper')
            }

        }
        if (key === 'KeyY' && cursorAt) {
            event.preventDefault();
            const ele = document.getElementById(cursorAt);
            if (ele) {
                register.current = [ele, ...register.current.slice(1)]
                // registerControls.replaceItemAtIndex(0, ele);
            }
        }
        if (key === 'KeyP' && cursorAt) {
            // behaviour of paste ??
            // lets experiment with only layout
            event.preventDefault();
            const ele = document.getElementById(cursorAt);
            if (ele && register.current[0]) {
                let sibling = cloneElement(register.current[0], setCursorAt, setCursorFocused);

                // @ts-ignore
                clearContent(sibling);
                // @ts-ignore
                addClassToLeaves(sibling, 'empty');
                // @ts-ignore
                addSibling(ele, sibling);
                // @ts-ignore
                updateCursorAt(sibling.id);
            }
        }
        if (key === 'Enter' && cursorAt) {
            event.preventDefault();
            document.getElementById(cursorAt)?.focus();
        }
        if (key === 'KeyD' && cursorAt) {
            event.preventDefault();
            let ele = document.getElementById(cursorAt);
            if (ele) {
                const parent = addParent(ele, setCursorAt, setCursorFocused);
                // @ts-ignore
                updateCursorAt(ele.id);
            }
        }
        if (key === 'KeyM' && cursorAt) {
            event.preventDefault();
            updateMode('Move');
        }
        if (key === 'KeyI' && cursorAt) {
            event.preventDefault();
            updateMode('Insert');
        }
        if (key === 'KeyU' && cursorAt) {
            event.preventDefault();
            updateMode('ColorPicker');
        }
        if (key === 'KeyB' && cursorAt) {
            event.preventDefault();
            updateMode('ColorBucket');
        }
        // if (key === 'KeyC' && cursorAt) {
        //   event.preventDefault();
        //   const ele = document.getElementById(cursorAt);
        //   if (ele) {
        //     console.log(ele.style.backgroundColor);
        //     ele.style.backgroundColor = updateBgColor(ele.style.backgroundColor);
        //     // ele.style.backgroundColor = '#484';
        //     console.log(ele.style.backgroundColor);
        //   }

        // }


    }
    console.log(event.code)
    // event.preventDefault();
}