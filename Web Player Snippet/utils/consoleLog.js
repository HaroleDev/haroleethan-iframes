import { debounce, throttle } from './debounceAndThrottle.js'
const consoleWelcomeDebounce = debounce(() => {
  console.log(
    '%cPlayful Video%c\nRolling Progress Release',
    'background-image: url(data:image/svg+xml;base64,' +
    btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" fill="#02da9a" viewBox="0 0 616 174"><path d="M290 .051a43 43 0 0 0-4.92.041c-3.75.245-7.43.979-11 2.17-4.44 1.5-5.82 6.79-3.47 10.8 2.34 4.06 7.56 5.29 12.2 4.37 1.12-.223 2.26-.372 3.4-.447a26 26 0 0 1 11.7 1.93c3.69 1.53 6.97 3.88 9.6 6.88a25.75 25.75 0 0 1 2.08 2.72c2.61 3.9 7.16 6.72 11.7 5.5s7.29-5.93 5.21-10.1a43.06 43.06 0 0 0-6.21-9.29c-4.35-4.96-9.78-8.85-15.9-11.4a43 43 0 0 0-14.3-3.22zM7 19.851c-3.27-.257-6.49 2.26-6.49 5.99v62.2c0 4.98 5.72 7.79 9.66 4.75l40.4-31.1c3.12-2.4 3.12-7.11 0-9.51l-40.4-31.1A5.96 5.96 0 0 0 7 19.841zm382 9.41v62c-3.07-5.63-7.42-9.86-13.1-12.7-5.63-2.94-12-4.42-19-4.42-9.34 0-17.4 2.18-24.2 6.53-6.79 4.22-12 10.1-15.6 17.7-3.59 7.55-5.38 16.1-5.38 25.7 0 9.73 1.79 18.3 5.38 25.7 3.59 7.3 8.64 13.1 15.2 17.3 6.66 4.22 14.5 6.34 23.6 6.34 7.3 0 13.9-1.6 19.8-4.8 6.02-3.33 10.6-8.06 13.6-14.2l1.34 16.5h17.7v-142h-19.4zm-281 .695c-14.9 0-27 12.1-27 27s12.1 27 27 27 27-12.1 27-27-12.1-27-27-27zm181 .455c-3.46 0-6.46 1.22-9.02 3.65-2.43 2.43-3.65 5.38-3.65 8.83s1.22 6.4 3.65 8.83c2.56 2.43 5.57 3.65 9.02 3.65 3.33 0 6.21-1.22 8.64-3.65s3.65-5.38 3.65-8.83-1.22-6.4-3.65-8.83-5.31-3.65-8.64-3.65zm176 43.8c-9.09 0-17.2 2.11-24.2 6.34-6.91 4.22-12.4 10-16.3 17.5-3.84 7.42-5.76 16.1-5.76 25.9 0 9.73 1.98 18.3 5.95 25.7 4.1 7.42 9.66 13.2 16.7 17.5 7.17 4.22 15.4 6.34 24.6 6.34 11.8 0 21.5-2.82 29.2-8.45s12.6-13.5 14.8-23.6h-18c-1.41 5.12-4.36 9.09-8.83 11.9-4.36 2.69-9.98 4.03-16.9 4.03-9.34 0-16.5-2.94-21.5-8.83-4.24-5-6.68-11.9-7.32-20.6l72.4-.172v-6.72c0-9.47-1.86-17.7-5.57-24.8-3.58-7.04-8.77-12.5-15.6-16.3-6.66-3.84-14.5-5.76-23.6-5.76zm102 0c-9.47 0-18 2.11-25.5 6.34-7.43 4.22-13.3 10-17.7 17.5-4.22 7.42-6.34 16-6.34 25.7s2.11 18.3 6.34 25.7c4.35 7.42 10.2 13.2 17.7 17.5 7.55 4.22 16.1 6.34 25.5 6.34s17.9-2.11 25.3-6.34 13.2-10 17.5-17.5 6.34-16 6.34-25.7-2.11-18.3-6.34-25.7c-4.22-7.42-10-13.2-17.5-17.5s-15.9-6.34-25.3-6.34zm-393 2.69l37.8 94.1H231l39.4-94.1h-20.2l-20.2 50.1-2.88 7.94-1.72 4.93c-1.41 3.97-2.56 7.49-3.46 10.6-.64-2.82-1.66-6.21-3.07-10.2-1.28-4.1-2.82-8.51-4.61-13.2l-19.4-50.1h-20.9zm105 0v94.1h19.2v-94.1H279zm186 13.4c7.68 0 13.8 2.3 18.4 6.91 4.61 4.48 6.91 10.4 6.91 17.9h-52.8c.528-3.55 1.43-6.75 2.7-9.6 2.3-4.99 5.5-8.77 9.6-11.3 4.23-2.56 9.28-3.84 15.2-3.84zm-105 1.15c6.02 0 11.1 1.41 15.4 4.22 4.35 2.69 7.68 6.46 9.98 11.3 2.3 4.74 3.46 10.2 3.46 16.5s-1.15 11.8-3.46 16.7-5.63 8.71-9.98 11.5c-4.23 2.69-9.35 4.03-15.4 4.03s-11.2-1.34-15.6-4.03c-4.22-2.82-7.49-6.66-9.79-11.5-2.18-4.86-3.26-10.4-3.26-16.7 0-6.14 1.09-11.6 3.26-16.3 2.3-4.86 5.57-8.7 9.79-11.5 4.35-2.82 9.54-4.22 15.6-4.22zm207 .191c5.89 0 11 1.35 15.4 4.03 4.48 2.69 8 6.46 10.6 11.3 2.56 4.74 3.84 10.3 3.84 16.7 0 6.27-1.28 11.8-3.84 16.7s-6.08 8.7-10.6 11.5c-4.35 2.69-9.47 4.03-15.4 4.03s-11.1-1.34-15.6-4.03c-4.48-2.82-8-6.66-10.6-11.5-2.56-4.86-3.84-10.4-3.84-16.7 0-6.4 1.28-12 3.84-16.7 2.56-4.86 6.08-8.64 10.6-11.3s9.66-4.03 15.6-4.03zm-449 15a10.85 10.85 0 0 0-2.2.123c-5.94.94-9.81 6.6-10.7 12.5-.567 3.69-1.72 7.29-3.43 10.7-3.38 6.63-8.77 12-15.4 15.4a35.2 35.2 0 0 1-32.1-.08c-5.34-2.76-12.2-2.95-16.5 1.3h-.002c-4.25 4.25-4.29 11.2.689 14.6a57 57 0 0 0 23 9.08c11.9 1.88 24.1-.047 34.8-5.51a57 57 0 0 0 31.08-48.8c.178-5.26-4.16-9.04-9.22-9.27z"/></svg>'
    ) +
    ');\n display: inline-block;\n padding: 2rem 12rem;\n padding-right: 0px;\n margin: 20px;\n margin-left: 0px;\n margin-bottom: 8px;\n color: transparent;\n text-align: center;\n font-size: 0px;\n background-size: contain;\n background-position: center center;\n background-repeat: no-repeat;\n ',
    'font-family: Manrope, Arial, Helvetica, sans-serif;\n display: block;\n font-size: 1rem;\n line-height: 130%;\n margin: 4px 0px 16px 0px;\n font-weight: 400;\n font-kerning: normal;\n color: currentColor;'
  ),
    console.log(
      '%cThis is a browser feature intended for developers to debug the player. As this is a rolling release of a developing project, I\'d encourage you to send a feedback to me once you discovered a bug not listed on the page (which you can by my Discord\'s username below).\n\nDiscord: %cHarole#1225\n%cWebsite (WIP): %chttps://preview.studio.site/live/4BqN8BM2Wr',
      'font-family: Inconsolata, monospace;\n font-size: 1rem;\n line-height: 130%;\n font-weight: 400;\n color: currentColor;\n ',
      'font-family: Inconsolata, monospace;\n font-size: 1rem;\n line-height: 100%;\n font-weight: 800;\n color: currentColor;\n border-bottom: 2px solid currentColor;\n ',
      'font-family: Inconsolata, monospace;\n font-size: 1rem;\n line-height: 130%;\n font-weight: 400;\n color: currentColor;\n ',
      'font-family: Inconsolata, monospace;\n font-size: 1rem;\n line-height: 100%;\n font-weight: 800;\n color: currentColor;\n '
    )
}, 200)
export { consoleWelcomeDebounce as default }
