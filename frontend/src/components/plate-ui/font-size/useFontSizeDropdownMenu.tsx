import {
  type TElement,
  getBlockAbove,
  getPluginInjectProps,
  isCollapsed,

  select,
  getMark,
  focusEditor,
  useEditorRef,
  useEditorSelector,
  setMarks,
} from '@udecode/plate-common';

import { useState, useCallback, useEffect } from 'react';
import { KEY_FONT_SIZE } from '@/components/plate-ui/font-size/font-size-plugin';
import { setFontSize } from "@/components/plate-ui/font-size/set-font-size"

export const useFontSizeDropdownMenuState = () => {
  const editor = useEditorRef();

  /* Сохранение состояния выбранного шрифта */

  const selectionDefined = useEditorSelector(
    (editor) => !!editor.selection,
    []
  );

  const font = useEditorSelector(
    (editor) => getMark(editor, KEY_FONT_SIZE) as number,
    [KEY_FONT_SIZE]
  );

  const [selectedFont, setSelectedFont] = useState<number>(14);
  const updateFont = useCallback(
    (value: number) => {
      if (editor.selection) {
        setSelectedFont(value);

        select(editor, editor.selection);
        focusEditor(editor);

        setMarks(editor, { [KEY_FONT_SIZE]: value });
      }
    },
    [editor, KEY_FONT_SIZE]
  );

  useEffect(() => {
    if (selectionDefined) {
      setSelectedFont(font);
    }
  }, [font, selectionDefined]);

  /* хз надо ли это */

  const { defaultNodeValue, validNodeValues: values = [] } =
    getPluginInjectProps(editor, KEY_FONT_SIZE);

  const value: string | undefined = useEditorSelector((editor) => {
    if (isCollapsed(editor.selection)) {
      const entry = getBlockAbove<TElement>(editor);

      if (entry) {
        return (
          values.find((item) => item === entry[0][KEY_FONT_SIZE]) ??
          defaultNodeValue
        );
      }
    }
  }, []);

  return {
    value,
    values,
    selectedFont,
    updateFont,
    font
  };
};



export const useFontSizeDropdownMenu = ({
                                            value,
                                          }: ReturnType<typeof useFontSizeDropdownMenuState>) => {
  const editor = useEditorRef();

  return {
    radioGroupProps: {
      onValueChange: (newValue: string) => {
        setFontSize(editor, {
          value: newValue,
        });
        focusEditor(editor);
      },
      value,
    },
  };
};