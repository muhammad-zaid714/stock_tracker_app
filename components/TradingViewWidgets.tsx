// TradingViewWidget.jsx
'use client';
import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';
import  { useRef, memo } from 'react';
interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, any>;
  height?: number;
  className?: string;
}
const TradingViewWidget = ({title,scriptUrl,config,height=600,className}:TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidget(scriptUrl,config,height);

  

  return (
    <div className='w-full'>
        {title && (
          <div className='px-6 py-4 border-b border-white/10'>
            <h3 className='text-lg font-semibold text-white'>{title}</h3>
          </div>
        )}
    <div className={cn('tradingview-widget-container p-2', className)} ref={containerRef} >
      <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>
     
    </div>
    </div>
  );
}

export default memo(TradingViewWidget);
