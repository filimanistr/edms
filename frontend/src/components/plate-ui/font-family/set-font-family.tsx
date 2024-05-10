import {
  type PlateEditor,
  type SetNodesOptions,
  type TNodeMatch,
  type Value,
  getPluginInjectProps,
  isBlock,
  setElements,
  unsetNodes,
} from '@udecode/plate-common';

import { KEY_FONT_FAMILY } from '@/components/plate-ui/font-family/font-family-plugin';

export const setFontFamily = <V extends Value>(
  editor: PlateEditor<V>,
  {
    setNodesOptions,
    value,
  }: { setNodesOptions?: SetNodesOptions<V>; value: string }
): void => {
  const { defaultNodeValue, nodeKey, validTypes } = getPluginInjectProps(
    editor,
    KEY_FONT_FAMILY
  );

  const match: TNodeMatch = (n) =>
    isBlock(editor, n) && !!validTypes && validTypes.includes(n.type as string);

  if (value === defaultNodeValue) {
    unsetNodes(editor, nodeKey!, {
      match,
      ...setNodesOptions,
    });
  } else {
    setElements(
      editor,
      { [nodeKey!]: value },
      {
        match: match as any,
        ...setNodesOptions,
      }
    );
  }
};