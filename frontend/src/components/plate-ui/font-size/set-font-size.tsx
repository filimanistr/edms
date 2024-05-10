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

import { KEY_FONT_SIZE } from '@/components/plate-ui/font-size/font-size-plugin';

export const setFontSize = <V extends Value>(
  editor: PlateEditor<V>,
  {
    setNodesOptions,
    value,
  }: { setNodesOptions?: SetNodesOptions<V>; value: string }
): void => {
  const { defaultNodeValue, nodeKey, validTypes } = getPluginInjectProps(
    editor,
    KEY_FONT_SIZE
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