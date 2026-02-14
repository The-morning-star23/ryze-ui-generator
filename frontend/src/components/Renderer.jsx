import React from 'react';
import { ComponentMap } from './ComponentMap';

export const UIRenderer = ({ node }) => {
  // If node is just a string or number, render it directly
  if (typeof node !== 'object' || node === null) return node;

  // 1. Check if the component exists in our allowed registry
  if (!node.component) return null;

  const Component = ComponentMap[node.component];

  // 2. ERROR CATCHER: If the component is not found in the registry, render a clear error message instead of crashing
  if (!Component) {
    return (
      <div className="p-4 my-2 border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-lg font-mono text-xs flex flex-col gap-1">
        <span className="font-bold uppercase">⚠️ Security/Validation Error</span>
        <span>Unknown component: <span className="font-black">"{node.component}"</span></span>
        <span className="text-[10px] opacity-70 italic mt-1">Registry violation: Determinism enforced.</span>
      </div>
    );
  }

  const renderChildren = (children) => {
    if (!children) return null;

    // Handle single children that might be objects
    if (!Array.isArray(children)) {
      if (typeof children === 'object' && children !== null) {
        if (children.component) return <UIRenderer node={children} />;
        return children.label || children.text || children.title || JSON.stringify(children);
      }
      return children;
    }

    // Handle array of children
    return children.map((child, i) => {
      if (typeof child === 'object' && child !== null) {
        // Recursive render for nested components
        if (child.component) return <UIRenderer key={i} node={child} />;
        
        // Final safety net: extract text from data objects
        return child.label || child.text || child.title || JSON.stringify(child);
      }
      return child;
    });
  };

  return (
    <Component {...(node.props || {})}>
      {renderChildren(node.children)}
    </Component>
  );
};