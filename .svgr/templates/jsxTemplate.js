const jsxTemplate = ({ componentName, jsx, imports, props }, { tpl }) => {
  const formattedComponentName = componentName.replace('Svg', '');
  const formattedComponentNameRef = `${formattedComponentName}ForwardRef`;

  return tpl`
    ${imports}
    
    const ${formattedComponentName} = (${props}) => (
      ${jsx}
    );

    const ${formattedComponentNameRef} = forwardRef(${formattedComponentName});

    export default ${formattedComponentNameRef}
  `;
};

module.exports = jsxTemplate;
