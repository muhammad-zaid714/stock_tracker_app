declare module 'react-select-country-list' {
  export default function countryList(): {
    getData(): Array<{ value: string; label: string }>;
    getValue(label: string): string;
    getLabel(value: string): string;
    getValues(): string[];
    getLabels(): string[];
    getNative(): boolean;
    setNative(native: boolean): void;
  };
}

declare module 'react-country-flag' {
  import { CSSProperties } from 'react';

  export interface ReactCountryFlagProps {
    countryCode: string;
    svg?: boolean;
    cdnUrl?: string;
    cdnSuffix?: string;
    style?: CSSProperties;
    title?: string;
    "aria-label"?: string;
    className?: string;
  }

  const ReactCountryFlag: React.FC<ReactCountryFlagProps>;
  export default ReactCountryFlag;
}
