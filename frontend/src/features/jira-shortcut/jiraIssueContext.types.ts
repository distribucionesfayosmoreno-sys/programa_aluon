export type ResponsiveCategory = 'mobile' | 'tablet' | 'desktop';

export type ViewportInfo = {
  category: ResponsiveCategory;
  widthPx: number;
  heightPx: number;
  devicePixelRatio: number;
};

export type JiraIssueContext = {
  environmentName: string;
  moduleKey: string;
  moduleLabel: string;
  viewport: ViewportInfo;
  url: string;
};

