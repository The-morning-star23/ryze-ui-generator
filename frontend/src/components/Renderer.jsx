import React from 'react';
import { ComponentMap } from './ComponentMap';

export const UIRenderer = ({ node }) => {
  if (!node || !node.component) return null;

  // Safety Fallback: If AI uses 'div' or 'span', treat it as a fragment or ignore it
  if (['div', 'span', 'p'].includes(node.component.toLowerCase())) {
     return (
       <>
         {Array.isArray(node.children) 
           ? node.children.map((child, i) => <UIRenderer key={i} node={child} />)
           : node.children}
       </>
     );
  }

  const Component = ComponentMap[node.component];

  // If the component is truly unknown, log it but don't break the UI
  if (!Component) {
    console.warn(`Safety: Blocked unauthorized component <${node.component}>`);
    return null; 
  }

  return (
    <Component {...node.props}>
      {Array.isArray(node.children) 
        ? node.children.map((child, i) => <UIRenderer key={i} node={child} />)
        : node.children}
    </Component>
  );
};