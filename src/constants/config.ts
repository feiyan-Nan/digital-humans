// 是否为IE
export const __IS_IE__: boolean = /rv:\d+/.test(navigator.userAgent);

export const __DEBUG__: boolean = process.env.NODE_ENV === 'development';
