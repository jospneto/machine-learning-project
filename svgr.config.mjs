/** @type {import('@svgr/core').Config} */
const svgrConfig = {
  typescript: true,
  jsxRuntime: 'automatic',
  ref: true,
  index: true,
  svgoConfig: {
    plugins: [
      {
        name: 'replaceColorValue',
        fn: ({ children }) => {
          const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

          const replaceColorValue = (children, value = 'currentColor') => {
            for (const element of children) {
              if (hexRegex.test(element?.attributes?.fill)) {
                element.attributes.fill = value;
              }
              if (hexRegex.test(element?.attributes?.stroke)) {
                element.attributes.stroke = value;
              }
              if (hexRegex.test(element?.attributes?.color)) {
                element.attributes.color = value;
              }

              if (element?.children?.length) {
                replaceColorValue(element?.children);
              }
            }
          };

          replaceColorValue(children);
        },
      },
    ],
  },
};

export default svgrConfig;
