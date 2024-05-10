import {
  ELEMENT_DEFAULT,
  createPluginFactory,
  getPluginType,
  mapInjectPropsToPlugin,
} from '@udecode/plate-common';

export const KEY_FONT_FAMILY = 'fontFamily';

export const createFontFamilyPlugin = createPluginFactory({
  inject: {
    props: {
      defaultNodeValue: "Times New Roman",
      nodeKey: KEY_FONT_FAMILY,
    },
  },
  key: KEY_FONT_FAMILY,
  then: (editor, { type }) => ({
    deserializeHtml: {
      getNode: (element) => ({ [type]: element.style.fontFamily }),
      isLeaf: true,
      rules: [
        {
          validStyle: {
            fontFamily: '*',
          },
        },
      ],
    },
  }),
});