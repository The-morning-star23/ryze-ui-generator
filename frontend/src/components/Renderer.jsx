import React from 'react';
import { ComponentMap } from './ComponentMap';

export const UIRenderer = ({ node }) => {
  if (!node || !node.component) return null;

  const Component = ComponentMap[node.component];

  // SAFETY: Show explicit error for unauthorized components like 'div'
  if (!Component) {
    return (
      <div className="p-4 my-2 border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-lg font-mono text-xs">
        ⚠️ Unknown component: {node.component}
      </div>
    );
  }

  const renderChildren = (children) => {
    if (!children) return null;
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === 'object' && child !== null) {
          if (child.component) return <UIRenderer key={i} node={child} />;
          // Fix for Error #31
          return child.label || child.text || child.title || JSON.stringify(child);
        }
        return child;
      });
    }
    return children;
  };

  return (
    <Component {...(node.props || {})}>
      {renderChildren(node.children)}
    </Component>
  );
};