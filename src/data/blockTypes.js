export const blockTypes = {
  text: {
    defaultProps: {
      content: '<p>Start typing here...</p>',
      fontSize: '16px',
      fontFamily: 'inherit',
      textColor: '#000000',
      backgroundColor: 'transparent',
      textAlign: 'left',
      paddingX: 16,
      paddingY: 16,
      marginX: 0,
      marginY: 8,
      borderRadius: 0,
    },
  },
  button: {
    defaultProps: {
      text: 'Click Me',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: 6,
      buttonPaddingX: 24,
      buttonPaddingY: 12,
      alignment: 'center',
      paddingX: 16,
      paddingY: 16,
      marginX: 0,
      marginY: 8,
    },
  },
};
