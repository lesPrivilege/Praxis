// The lab holds more than one workbench. This is the lab's own chrome, not part of either product.
import { Select } from 'antd';
import { useNavigate } from 'react-router';

const WORKBENCHES = [
  { value: '/matters', label: '事项工作台' },
  { value: '/reviews', label: '付款复核台' },
];

export function WorkbenchSwitch({ current }: { current: '/matters' | '/reviews' }) {
  const navigate = useNavigate();
  return (
    <Select
      aria-label="工作台"
      variant="borderless"
      className="workbench-switch"
      value={current}
      onChange={(to) => navigate(to)}
      options={WORKBENCHES}
      popupMatchSelectWidth={false}
    />
  );
}
