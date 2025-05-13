// TradingView adapter for chart integration

export const initTradingView = async (
  container: HTMLElement | null,
  symbol: string,
  interval: string
): Promise<any> => {
  if (!container) throw new Error('Container element is required');
  
  try {
    // Load TradingView library if not already loaded
    if (!(window as any).TradingView) {
      await loadTradingViewScript();
    }
    
    // Create TradingView widget
    const widget = new (window as any).TradingView.widget({
      container_id: container.id || 'tv_chart_container',
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#1A1C25",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      save_image: false,
      studies: ["RSI@tv-basicstudies"],
      drawings_access: { type: "black", tools: [{ name: "Regression Trend" }] },
      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
        "symbol_search_hot_key",
        "header_compare",
      ],
      enabled_features: ["study_templates"],
      overrides: {
        "mainSeriesProperties.style": 1,
        "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
        "paneProperties.background": "#0F1117",
        "paneProperties.vertGridProperties.color": "rgba(42, 44, 53, 0.5)",
        "paneProperties.horzGridProperties.color": "rgba(42, 44, 53, 0.5)",
        "scalesProperties.textColor": "#A0A0B0"
      },
    });
    
    // Return the widget instance
    return widget;
  } catch (error) {
    console.error("Failed to initialize TradingView chart:", error);
    throw error;
  }
};

// Load TradingView script
const loadTradingViewScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).TradingView) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    
    document.head.appendChild(script);
  });
};

// Set symbol for existing chart
export const setChartSymbol = (widget: any, symbol: string): void => {
  if (!widget) return;
  
  widget.setSymbol(symbol, () => {
    console.log(`Chart symbol updated to ${symbol}`);
  });
};

// Set interval for existing chart
export const setChartInterval = (widget: any, interval: string): void => {
  if (!widget) return;
  
  widget.setInterval(interval);
};
