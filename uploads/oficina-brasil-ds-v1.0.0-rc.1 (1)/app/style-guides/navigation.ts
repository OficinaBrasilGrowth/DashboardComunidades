export interface NavItem {
  name: string
  href: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    title: 'Fundação',
    items: [
      { name: 'Tokens de design', href: '/style-guides' },
    ],
  },
  {
    title: 'Componentes',
    items: [
      { name: 'Accordion', href: '/style-guides/components/accordion' },
      { name: 'AdminPageHeader', href: '/style-guides/components/admin-page-header' },
      { name: 'Alert', href: '/style-guides/components/alert' },
      { name: 'AlertDialog', href: '/style-guides/components/alert-dialog' },
      { name: 'Avatar', href: '/style-guides/components/avatar' },
      { name: 'AvatarGroup', href: '/style-guides/components/avatar-group' },
      { name: 'Badge', href: '/style-guides/components/badge' },
      { name: 'BarChart', href: '/style-guides/components/bar-chart' },
      { name: 'BrandSelect', href: '/style-guides/components/select' },
      { name: 'Breadcrumb', href: '/style-guides/components/breadcrumb' },
      { name: 'Button', href: '/style-guides/components/button' },
      { name: 'ChartCard', href: '/style-guides/components/chart-card' },
      { name: 'Checkbox', href: '/style-guides/components/checkbox' },
      { name: 'CommandPalette', href: '/style-guides/components/command-palette' },
      { name: 'Considerations', href: '/style-guides/components/considerations' },
      { name: 'CopyButton', href: '/style-guides/components/copy-button' },
      { name: 'DataTable', href: '/style-guides/components/data-table' },
      { name: 'DatePicker', href: '/style-guides/components/date-picker' },
      { name: 'DropdownMenu', href: '/style-guides/components/dropdown-menu' },
      { name: 'EmptyState', href: '/style-guides/components/empty-state' },
      { name: 'FileUploadButton', href: '/style-guides/components/file-upload-button' },
      { name: 'FilterBar', href: '/style-guides/components/filter-bar' },
      { name: 'InfoTooltip', href: '/style-guides/components/info-tooltip' },
      { name: 'IconButton', href: '/style-guides/components/icon-button' },
      { name: 'Input', href: '/style-guides/components/input' },
      { name: 'KpiCard', href: '/style-guides/components/kpi-card' },
      { name: 'Label', href: '/style-guides/components/label' },
      { name: 'LineChart', href: '/style-guides/components/line-chart' },
      { name: 'Modal', href: '/style-guides/components/modal' },
      { name: 'MultiSelect', href: '/style-guides/components/multi-select' },
      { name: 'Pagination', href: '/style-guides/components/pagination' },
      { name: 'Popover', href: '/style-guides/components/popover' },
      { name: 'ProgressBar', href: '/style-guides/components/progress-bar' },
      { name: 'ProgressRing', href: '/style-guides/components/progress-ring' },
      { name: 'RadioGroup', href: '/style-guides/components/radio-group' },
      { name: 'Skeleton', href: '/style-guides/components/skeleton' },
      { name: 'Slider', href: '/style-guides/components/slider' },
      { name: 'StatComparison', href: '/style-guides/components/stat-comparison' },
      { name: 'Switch', href: '/style-guides/components/switch' },
      { name: 'Tabs', href: '/style-guides/components/tabs' },
      { name: 'Textarea', href: '/style-guides/components/textarea' },
      { name: 'Toast', href: '/style-guides/components/toast' },
      { name: 'Tooltip', href: '/style-guides/components/tooltip' },
      { name: 'TreeView', href: '/style-guides/components/tree-view' },
      { name: 'VisuallyHiddenInput', href: '/style-guides/components/visually-hidden-input' },
    ],
  },
  // "Grafismos de marca" (LogoCutout) fora do escopo público — código
  // arquivado, não apagado: components/_archive/logo-cutout.tsx.
]
