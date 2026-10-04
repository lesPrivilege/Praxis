import type { ThemeConfig } from 'antd';

// Cool neutrals and one blue. Blue marks where a person acts; red and amber are kept for
// severity and for things that need re-checking.
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1f5fd1',
    colorInfo: '#1f5fd1',
    colorLink: '#1f5fd1',
    colorTextBase: '#1b2633',
    colorBgLayout: '#f3f6f9',
    colorBorder: '#d3dbe4',
    colorBorderSecondary: '#e4e9ef',
    borderRadius: 4,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Layout: { headerBg: '#ffffff', headerHeight: 52, headerPadding: '0 20px', siderBg: '#ffffff' },
    Table: { headerBg: '#f3f6f9' },
  },
};
