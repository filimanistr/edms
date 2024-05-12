import {createBlockquotePlugin, ELEMENT_BLOCKQUOTE} from "@udecode/plate-block-quote";
import {createTodoListPlugin, ELEMENT_LI, ELEMENT_OL, ELEMENT_TODO_LI, ELEMENT_UL} from "@udecode/plate-list";
import {createParagraphPlugin, ELEMENT_PARAGRAPH} from "@udecode/plate-paragraph";
import {
  createCodeBlockPlugin,
  ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE, ELEMENT_CODE_SYNTAX,
  isCodeBlockEmpty,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock
} from "@udecode/plate-code-block";
import {
  createPlugins,
  isBlockAboveEmpty,
  isSelectionAtBlockStart, PlateElement, PlateLeaf,
  RenderAfterEditable,
  someNode
} from "@udecode/plate-common";
import {createFontFamilyPlugin} from "@/components/plate-ui/font-family/font-family-plugin";
import {createFontSizePlugin} from "@/components/plate-ui/font-size/font-size-plugin";
import {createDeserializeDocxPlugin} from "@udecode/plate-serializer-docx";
import {createJuicePlugin} from "@udecode/plate-juice";
import {
  createHeadingPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4, ELEMENT_H5, ELEMENT_H6,
  KEYS_HEADING
} from "@udecode/plate-heading";
import {createHorizontalRulePlugin, ELEMENT_HR} from "@udecode/plate-horizontal-rule";
import {createLinkPlugin, ELEMENT_LINK} from "@udecode/plate-link";
import {LinkFloatingToolbar} from "@/components/plate-ui/link-floating-toolbar";
import {createImagePlugin, createMediaEmbedPlugin, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED} from "@udecode/plate-media";
import {createCaptionPlugin} from "@udecode/plate-caption";
import {createMentionPlugin, ELEMENT_MENTION, ELEMENT_MENTION_INPUT} from "@udecode/plate-mention";
import {createTablePlugin, ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TH, ELEMENT_TR} from "@udecode/plate-table";
import {createExcalidrawPlugin, ELEMENT_EXCALIDRAW} from "@udecode/plate-excalidraw";
import {
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createUnderlinePlugin,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE
} from "@udecode/plate-basic-marks";
import {createFontBackgroundColorPlugin, createFontColorPlugin} from "@udecode/plate-font";
import {createHighlightPlugin, MARK_HIGHLIGHT} from "@udecode/plate-highlight";
import {createKbdPlugin, MARK_KBD} from "@udecode/plate-kbd";
import {createAlignPlugin} from "@udecode/plate-alignment";
import {createIndentPlugin} from "@udecode/plate-indent";
import {createIndentListPlugin, KEY_LIST_STYLE_TYPE} from "@udecode/plate-indent-list";
import {createLineHeightPlugin} from "@udecode/plate-line-height";
import {createBlockSelectionPlugin} from "@udecode/plate-selection";
import {createComboboxPlugin} from "@udecode/plate-combobox";
import {createExitBreakPlugin, createSoftBreakPlugin} from "@udecode/plate-break";
import {createNodeIdPlugin} from "@udecode/plate-node-id";
import {createResetNodePlugin} from "@udecode/plate-reset-node";
import {createTabbablePlugin} from "@udecode/plate-tabbable";
import {TableElement} from "@/components/plate-ui/table-element";
import {createTrailingBlockPlugin} from "@udecode/plate-trailing-block";
import {createCommentsPlugin, MARK_COMMENT} from "@udecode/plate-comments";
import {createDeserializeMdPlugin} from "@udecode/plate-serializer-md";
import {withPlaceholders} from "@/components/plate-ui/placeholder";
import {BlockquoteElement} from "@/components/plate-ui/blockquote-element";
import {CodeBlockElement} from "@/components/plate-ui/code-block-element";
import {CodeLineElement} from "@/components/plate-ui/code-line-element";
import {CodeSyntaxLeaf} from "@/components/plate-ui/code-syntax-leaf";
import {HrElement} from "@/components/plate-ui/hr-element";
import {withProps} from "@udecode/cn";
import {HeadingElement} from "@/components/plate-ui/heading-element";
import {ImageElement} from "@/components/plate-ui/image-element";
import {LinkElement} from "@/components/plate-ui/link-element";
import {MediaEmbedElement} from "@/components/plate-ui/media-embed-element";
import {MentionElement} from "@/components/plate-ui/mention-element";
import {MentionInputElement} from "@/components/plate-ui/mention-input-element";
import {ListElement} from "@/components/plate-ui/list-element";
import {ParagraphElement} from "@/components/plate-ui/paragraph-element";
import {TableCellElement, TableCellHeaderElement} from "@/components/plate-ui/table-cell-element";
import {TodoListElement} from "@/components/plate-ui/todo-list-element";
import {TableRowElement} from "@/components/plate-ui/table-row-element";
import {ExcalidrawElement} from "@/components/plate-ui/excalidraw-element";
import {CodeLeaf} from "@/components/plate-ui/code-leaf";
import {HighlightLeaf} from "@/components/plate-ui/highlight-leaf";
import {KbdLeaf} from "@/components/plate-ui/kbd-leaf";
import {CommentLeaf} from "@/components/plate-ui/comment-leaf";

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
};

const resetBlockTypesCodeBlockRule = {
  types: [ELEMENT_CODE_BLOCK],
  defaultType: ELEMENT_PARAGRAPH,
  onReset: unwrapCodeBlock,
};


export const plugins = createPlugins(
  [
    createFontFamilyPlugin(),
    createFontSizePlugin({
      inject: {
        props: {
          defaultNodeValue: 14,
          validNodeValues: [
            5, 10, 14, 44, 72
          ],
        },
      },
    }),

    // Copy from docx, should be working but with issues
    createDeserializeDocxPlugin(),
    createJuicePlugin(),

    // Nodes
    createParagraphPlugin(),
    createHeadingPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createHorizontalRulePlugin(),
    createLinkPlugin({
      renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
    }),
    createImagePlugin(),
    createMediaEmbedPlugin(),
    createCaptionPlugin({
      options: { pluginKeys: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED] },
    }),
    createMentionPlugin(),
    createTablePlugin(),
    createTodoListPlugin(),
    createExcalidrawPlugin(),

    // Marks
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
    createHighlightPlugin(),
    createKbdPlugin(),

    // Block Style
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3],
        },
      },
    }),
    createIndentPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            ELEMENT_H1,
            ELEMENT_H2,
            ELEMENT_H3,
            ELEMENT_BLOCKQUOTE,
            ELEMENT_CODE_BLOCK,
          ],
        },
      },
    }),
    createIndentListPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            ELEMENT_H1,
            ELEMENT_H2,
            ELEMENT_H3,
            ELEMENT_BLOCKQUOTE,
            ELEMENT_CODE_BLOCK,
          ],
        },
      },
    }),
    createLineHeightPlugin({
      inject: {
        props: {
          defaultNodeValue: 1.5,
          validNodeValues: [1, 1.2, 1.5, 2, 3],
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3],
        },
      },
    }),

    // Functionality
    createBlockSelectionPlugin({
      options: {
        sizes: {
          top: 0,
          bottom: 0,
        },
      },
    }),
    createComboboxPlugin(),
    createExitBreakPlugin({
      options: {
        rules: [
          {
            hotkey: 'mod+enter',
          },
          {
            hotkey: 'mod+shift+enter',
            before: true,
          },
          {
            hotkey: 'enter',
            query: {
              start: true,
              end: true,
              allow: KEYS_HEADING,
            },
            relative: true,
            level: 1,
          },
        ],
      },
    }),
    createNodeIdPlugin(),
    createResetNodePlugin({
      options: {
        rules: [
          {
            ...resetBlockTypesCommonRule,
            hotkey: 'Enter',
            predicate: isBlockAboveEmpty,
          },
          {
            ...resetBlockTypesCommonRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtBlockStart,
          },
          {
            ...resetBlockTypesCodeBlockRule,
            hotkey: 'Enter',
            predicate: isCodeBlockEmpty,
          },
          {
            ...resetBlockTypesCodeBlockRule,
            hotkey: 'Backspace',
            predicate: isSelectionAtCodeBlockStart,
          },
        ],
      },
    }),
    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: 'shift+enter' },
          {
            hotkey: 'enter',
            query: {
              allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
            },
          },
        ],
      },
    }),
    createTabbablePlugin({
      options: {
        query: (editor) => {
          if (isSelectionAtBlockStart(editor)) return false;

          return !someNode(editor, {
            match: (n) => {
              return !!(
                n.type &&
                ([ELEMENT_TABLE, ELEMENT_LI, ELEMENT_CODE_BLOCK].includes(
                    n.type as string
                  ) ||
                  n[KEY_LIST_STYLE_TYPE])
              );
            },
          });
        },
      },
      plugins: [
        {
          key: 'tabbable_element',
          isElement: true,
          isVoid: true,
          component: TableElement,
        },
      ],
    }),
    createTrailingBlockPlugin({
      options: { type: ELEMENT_PARAGRAPH },
    }),

    // Collaboration
    createCommentsPlugin(),

    // Deserialization
    createDeserializeDocxPlugin(),
    createDeserializeMdPlugin(),
    createJuicePlugin(),
  ],
  {
    components:
      withPlaceholders({
          [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
          [ELEMENT_CODE_BLOCK]: CodeBlockElement,
          [ELEMENT_CODE_LINE]: CodeLineElement,
          [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
          [ELEMENT_HR]: HrElement,
          [ELEMENT_H1]: withProps(HeadingElement, { variant: 'h1' }),
          [ELEMENT_H2]: withProps(HeadingElement, { variant: 'h2' }),
          [ELEMENT_H3]: withProps(HeadingElement, { variant: 'h3' }),
          [ELEMENT_H4]: withProps(HeadingElement, { variant: 'h4' }),
          [ELEMENT_H5]: withProps(HeadingElement, { variant: 'h5' }),
          [ELEMENT_H6]: withProps(HeadingElement, { variant: 'h6' }),
          [ELEMENT_IMAGE]: ImageElement,
          [ELEMENT_LI]: withProps(PlateElement, { as: 'li' }),
          [ELEMENT_LINK]: LinkElement,
          [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
          [ELEMENT_MENTION]: MentionElement,
          [ELEMENT_MENTION_INPUT]: MentionInputElement,
          [ELEMENT_UL]: withProps(ListElement, { variant: 'ul' }),
          [ELEMENT_OL]: withProps(ListElement, { variant: 'ol' }),
          [ELEMENT_PARAGRAPH]: ParagraphElement,
          [ELEMENT_TABLE]: TableElement,
          [ELEMENT_TD]: TableCellElement,
          [ELEMENT_TH]: TableCellHeaderElement,
          [ELEMENT_TODO_LI]: TodoListElement,
          [ELEMENT_TR]: TableRowElement,
          [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
          [MARK_BOLD]: withProps(PlateLeaf, { as: 'strong' }),
          [MARK_CODE]: CodeLeaf,
          [MARK_HIGHLIGHT]: HighlightLeaf,
          [MARK_ITALIC]: withProps(PlateLeaf, { as: 'em' }),
          [MARK_KBD]: KbdLeaf,
          [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: 's' }),
          [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: 'sub' }),
          [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: 'sup' }),
          [MARK_UNDERLINE]: withProps(PlateLeaf, { as: 'u' }),
          [MARK_COMMENT]: CommentLeaf,
        }
      ),
  }
);
