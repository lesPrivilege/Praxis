// Jump to an object or a view by typing. Opens with ⌘K / Ctrl+K.
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Typography } from 'antd';
import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router';

export interface PaletteCommand {
  key: string;
  label: string;
  hint: string;
  to: string;
}

export function CommandPalette({
  commands,
  placeholder,
  useResults,
}: {
  // Fixed destinations, filtered by the text typed.
  commands: PaletteCommand[];
  placeholder: string;
  // The scenario's search, as a hook: objects matching the text, as destinations.
  useResults: (text: string) => { results: PaletteCommand[]; searching: boolean; failed: boolean };
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const listId = useId();
  const search = useResults(text);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const needle = text.trim().toLowerCase();
  const options: PaletteCommand[] = [
    ...commands.filter((c) => !needle || c.label.toLowerCase().includes(needle)),
    ...(needle ? search.results : []),
  ];
  const current = Math.min(active, Math.max(options.length - 1, 0));

  const close = () => {
    setOpen(false);
    setText('');
    setActive(0);
  };
  const go = (command: PaletteCommand | undefined) => {
    if (!command) return;
    navigate(command.to);
    close();
  };

  return (
    <>
      <Button icon={<SearchOutlined />} onClick={() => setOpen(true)}>
        搜索与跳转 <Typography.Text keyboard>⌘K</Typography.Text>
      </Button>
      <Modal open={open} onCancel={close} footer={null} closable={false} destroyOnHidden title="搜索与跳转" width={560}>
        <Input
          autoFocus
          size="large"
          prefix={<SearchOutlined />}
          placeholder={placeholder}
          value={text}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={options[current] ? `${listId}-${current}` : undefined}
          onChange={(event) => {
            setText(event.target.value);
            setActive(0);
          }}
          aria-autocomplete="list"
          onKeyDown={(event) => {
            // Enter that confirms an input-method candidate is not Enter on the list.
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown') setActive(Math.min(current + 1, options.length - 1));
            else if (event.key === 'ArrowUp') setActive(Math.max(current - 1, 0));
            else if (event.key === 'Enter') go(options[current]);
            else return;
            event.preventDefault();
          }}
        />
        <ul id={listId} role="listbox" aria-label="跳转目标" className="palette-list">
          {options.map((option, index) => (
            <li
              key={option.key}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === current}
              className={index === current ? 'palette-option palette-option-active' : 'palette-option'}
              onMouseEnter={() => setActive(index)}
              onClick={() => go(option)}
            >
              <span>{option.label}</span>
              <Typography.Text type="secondary">{option.hint}</Typography.Text>
            </li>
          ))}
        </ul>
        {options.length === 0 && (
          <Typography.Text type="secondary">
            {search.failed ? '搜索没有取到结果，稍后再试。' : search.searching ? '正在搜索。' : '没有匹配的结果。'}
          </Typography.Text>
        )}
      </Modal>
    </>
  );
}
