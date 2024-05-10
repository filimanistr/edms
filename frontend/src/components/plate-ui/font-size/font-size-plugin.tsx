import { createPluginFactory } from '@udecode/plate-common';

export const KEY_FONT_SIZE = 'fontSize';

export const createFontSizePlugin = createPluginFactory({
  inject: {
    props: {
      nodeKey: KEY_FONT_SIZE,
    },
  },
  key: KEY_FONT_SIZE,
  then: (editor, { type }) => ({
    deserializeHtml: {
      getNode: (element) => ({ [type]: element.style.fontSize }),
      isLeaf: true,
      rules: [
        {
          validStyle: {
            fontSize: '*',
          },
        },
      ],
    },
  }),
});