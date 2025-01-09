import React from 'react';

export default function TabPanel(props) {
  const { children, value, index, isKeepMouted, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}>
      {isKeepMouted ? (
        <div style={{ display: value === index ? 'block' : 'none' }}>
          {children}
        </div>
      ) : (
        value === index && <div>{children}</div>
      )}
    </div>
  );
}
