const buildCustomLineHeightClasses = () => {
  const lineHeight = {};
  for (let i = 1; i <= 50; i++) {
    lineHeight[`.lh-${i}`] = {
      'line-height': `${i * 0.0625}rem`,
    };
  }
  return lineHeight;
};

const buildCustomFontWeightScale = () => {
  const fontWeight = {};
  for (let i = 1; i <= 9; i++) {
    fontWeight[`.fw-${i}`] = {
      'font-weight': `${i * 100}`,
    };
  }
  return fontWeight;
};

const buildCustomFontSizeClasses = () => {
  const fontSize = {};
  for (let i = 1; i <= 50; i++) {
    fontSize[`.fs-${i}`] = {
      'font-size': `${i * 0.0625}rem`,
    };
  }
  return fontSize;
};

const buildCustomBorderRadiusClasses = () => {
  const borderRadius = {};
  for (let i = 1; i <= 50; i++) {
    borderRadius[`.br-${i}`] = {
      'border-radius': `${i * 0.0625}rem`,
    };
  }
  return borderRadius;
};

const buildCustomBorderBottomRightLeftClasses = () => {
  const borderBottomRightLeft = {};
  for (let i = 1; i <= 50; i++) {
    borderBottomRightLeft[`.bblr-${i}`] = {
      'border-bottom-left-radius': `${i * 0.0625}rem`,
      'border-bottom-right-radius': `${i * 0.0625}rem`,
    };
  }
  return borderBottomRightLeft;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/!(*.stories|*.spec).{ts,html}'],
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ...buildCustomFontWeightScale(),
        ...buildCustomLineHeightClasses(),
        ...buildCustomBorderRadiusClasses(),
        ...buildCustomFontSizeClasses(),
        ...buildCustomBorderBottomRightLeftClasses(),
      });
    },
  ],
};
