// What can be done with an object, and the form for doing it. The form is tied to the version
// the person was reading: if the object changes underneath, they re-check before submitting.
// A scenario supplies only the fields of each action and how they become its input.
import { Alert, Button, Flex, Form, Modal, Typography } from 'antd';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useBlocker } from 'react-router';
import { useUnloadConfirm } from '../api/attempt.ts';
import type { Attempt } from '../api/attempt.ts';
import type { W } from '../api/core.ts';
import { ActionBar } from './ActionBar.tsx';
import { AttemptNotice } from './AttemptNotice.tsx';

export interface ActionSpec {
  attempt: Attempt<any, W['ActionResult']>;
  // Form items for this action. `fill` lets a helper button put values in; that counts as unsent input.
  fields: (fill: (values: Record<string, unknown>) => void) => ReactNode;
  // Turns the form's values into the action's input and submits it against the version that was read.
  submit: (values: any, readVersion: number) => void;
}

export function ActionPanel({
  target,
  version,
  actions,
  labels,
  primary,
  specs,
  applied,
}: {
  // How the object is named in messages, e.g. "R-3104".
  target: string;
  version: number;
  actions: W['Affordance'][];
  labels: Record<string, string>;
  primary?: string;
  specs: Record<string, ActionSpec>;
  applied: (result: W['ActionResult'], attemptId: string) => ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  // The version the person has read. Submissions are made against it.
  const [readVersion, setReadVersion] = useState(version);
  const [dirty, setDirty] = useState(false);
  const [form] = Form.useForm();

  const spec = active ? specs[active] : null;
  const attempt = spec?.attempt ?? null;
  const phase = attempt?.state.phase ?? 'idle';
  const allowed = actions.find((a) => a.type === active)?.allowed ?? false;
  const moved = version !== readVersion;
  const locked = phase === 'submitting' || phase === 'unknown';
  const label = active ? (labels[active] ?? active) : '';

  const pick = (type: string) => {
    if (locked || !specs[type] || (type === active && phase !== 'applied')) return;
    // Each action starts from an empty form and no leftover notice; what was typed for another action is not carried over.
    specs[type].attempt.reset();
    form.resetFields();
    setDirty(false);
    setActive(type);
    setReadVersion(version);
  };

  // Cancelling discards what was typed. It does not undo anything already submitted.
  const cancel = () => {
    form.resetFields();
    setDirty(false);
    setActive(null);
  };

  // Leaving the page would drop unsent input, or the attempt number needed to check an unknown outcome.
  const unsent = dirty && active !== null && phase !== 'applied';
  // In-app navigation is held by the blocker below; closing or reloading the tab by the browser's own dialog.
  useUnloadConfirm(unsent);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => (unsent || locked) && currentLocation.pathname !== nextLocation.pathname,
  );

  return (
    <Flex vertical gap={16} className="action-area">
      <Modal
        open={blocker.state === 'blocked'}
        title={locked ? '这次提交的结果还不知道' : '有尚未提交的内容'}
        okText="仍然离开"
        cancelText="留在这里"
        okButtonProps={{ danger: true }}
        onOk={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      >
        {locked
          ? `离开之后页面不再保留尝试编号，只能靠 ${target} 的当前状态判断动作是否生效。`
          : '离开之后，已填写的内容不会保留。已经提交的动作不受影响。'}
      </Modal>

      <ActionBar actions={actions} labels={labels} primary={primary} active={phase === 'applied' ? null : active} onPick={pick} />
      {attempt && <AttemptNotice attempt={attempt} applied={applied} />}

      {spec && active && phase !== 'applied' && (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => spec.submit(values, readVersion)}
          onValuesChange={() => setDirty(true)}
          disabled={locked}
          className="action-form"
          aria-label={label}
        >
          <Typography.Title level={5}>{label}</Typography.Title>
          {moved && allowed && (
            <Alert
              type="warning"
              showIcon
              title={`${target} 已更新到第 ${version} 版`}
              description={`你开始填写时是第 ${readVersion} 版。上面显示的已是当前内容，你填写的内容没有丢。核对之后再提交。`}
              action={
                <Button size="small" onClick={() => setReadVersion(version)}>
                  已核对第 {version} 版
                </Button>
              }
            />
          )}
          {!allowed && <Alert type="warning" showIcon title={`当前状态下不能${label}`} description="你填写的内容保留在下面，可以复制到别处。" />}
          {spec.fields((values) => {
            form.setFieldsValue(values);
            setDirty(true);
          })}
          <Flex gap={8} align="center" wrap>
            <Button type="primary" htmlType="submit" loading={phase === 'submitting'} disabled={moved || !allowed}>
              {label}
            </Button>
            <Button onClick={cancel} disabled={locked}>
              取消填写
            </Button>
            <Typography.Text type="secondary">
              针对 {target} 第 {readVersion} 版提交
            </Typography.Text>
          </Flex>
        </Form>
      )}
    </Flex>
  );
}
