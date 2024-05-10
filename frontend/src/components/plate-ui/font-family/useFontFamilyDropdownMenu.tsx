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
import { KEY_FONT_FAMILY } from '@/components/plate-ui/font-family/font-family-plugin';
import { setFontFamily } from "@/components/plate-ui/font-family/set-font-family"

export const useFontFamilyDropdownMenuState = () => {
  const editor = useEditorRef();

  /* Сохранение состояния выбранного шрифта */

  const selectionDefined = useEditorSelector(
    (editor) => !!editor.selection,
    []
  );

  const font = useEditorSelector(
    (editor) => getMark(editor, KEY_FONT_FAMILY) as string,
    [KEY_FONT_FAMILY]
  );

  const [selectedFont, setSelectedFont] = useState<string>("Times New Roman");
  const updateFont = useCallback(
    (value: string) => {
      if (editor.selection) {
        setSelectedFont(value);

        select(editor, editor.selection);
        focusEditor(editor);

        setMarks(editor, { [KEY_FONT_FAMILY]: value });
      }
    },
    [editor, KEY_FONT_FAMILY]
  );

  useEffect(() => {
    if (selectionDefined) {
      setSelectedFont(font);
    }
  }, [font, selectionDefined]);

  /* хз надо ли это */

  const { defaultNodeValue, validNodeValues: values = [] } =
    getPluginInjectProps(editor, KEY_FONT_FAMILY);

  const value: string | undefined = useEditorSelector((editor) => {
    if (isCollapsed(editor.selection)) {
      const entry = getBlockAbove<TElement>(editor);

      if (entry) {
        return (
          values.find((item) => item === entry[0][KEY_FONT_FAMILY]) ??
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



export const useFontFamilyDropdownMenu = ({
                                            value,
                                          }: ReturnType<typeof useFontFamilyDropdownMenuState>) => {
  const editor = useEditorRef();

  return {
    radioGroupProps: {
      onValueChange: (newValue: string) => {
        setFontFamily(editor, {
          value: newValue,
        });
        focusEditor(editor);
      },
      value,
    },
  };
};