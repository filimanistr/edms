'use client';

import React from 'react';
import {
  focusEditor,
  insertText,
  useEditorRef,
  insertNodes
} from '@udecode/plate-common';

import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useOpenState,
} from '../dropdown-menu';
import { ToolbarButton } from '../toolbar';

const items = [
  {
    label: 'Вставить данные',
    items: [
      {
        label: 'Номер договора',
        value: 'contract__name',
      },
      {
        label: 'Название услуги',
        value: 'service__name',
      },
    ],
  },
  {
    label: 'Личные данные',
    items: [
      {
        label: 'Фамилия',
        value: 'head_last_name',
      },
      {
        label: 'Имя',
        value: 'head_first_name',
      },
      {
        label: 'Отчество',
        value: 'head_middle_name',
      },
      {
        label: 'Фамилия в род. пад.',
        value: 'head_pos_last_name',
      },
      {
        label: 'Имя в род. пад.',
        value: 'head_pos_first_name',
      },
      {
        label: 'Отчество в род. пад.',
        value: 'head_pos_middle_name',
      },
    ],
  },
  {
    label: "Данные организации",
    items: [
      {
        label: 'Наименование организации',
        value: 'full_name'
      },
      {
        label: 'Краткое наименование',
        value: 'name'
      },
      {
        label: 'Основания',
        value: 'reason',
      },
      {
        label: 'ИНН',
        value: 'INN'
      },
      {
        label: 'КПП',
        value: 'KPP'
      },
    ],
  },
  {
    label: 'Банковские данные',
    items: [
      {
        label: 'Наименование банка',
        value: 'bank_name',
      },
      {
        label: 'БИК банка',
        value: 'BIC',
      },
      {
        label: 'Корреспондентский счет',
        value: 'correspondent_account',
      },
      {
        label: 'Расчетный счет',
        value: 'checking_account',
      },
      {
        label: 'Личный счет',
        value: 'personal_account',
      },
    ],
  },
];

export function InsertDataDropdownMenu({userData = null}) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Вставить" isDropdown>
          <Icons.add />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {nestedItems.map(({label:itemLabel, value: type}) => (
                <DropdownMenuItem
                  key={type}
                  className="min-w-[180px]"
                  onSelect={() => {
                    { userData === null
                      ?
                      insertNodes(
                        editor, [
                          {
                            text: itemLabel,
                            backgroundColor: "#FEFF00",
                          },
                          {
                            text: " "
                          }]
                      )
                      : insertText(editor, userData[type])
                    }
                      focusEditor(editor);
                  }}
                >
                  {itemLabel}
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
