import React from 'react';
import { ComponentMap } from './ComponentMap';

export const UIRenderer = ({ node }) => {
  // 1. Base Case: If node is empty or missing a component name, stop.
  if (!node || !node.component) return null;

  // 2. Safety Fallback: Handle standard HTML tag hallucinations (div, span, p).
  if (['div', 'span', 'p'].includes(node.component.toLowerCase())) {
    return (
      <>
        {Array.isArray(node.children) 
          ? node.children.map((child, i) => <UIRenderer key={i} node={child} />)
          : typeof node.children === 'object' && node.children !== null
            ? node.children.text || node.children.label || JSON.stringify(node.children)
            : node.children}
      </>
    );
  }

  // 3. Deterministic Lookup: Only allow components from our Whitelist (ComponentMap).
  const Component = ComponentMap[node.component];

  if (!Component) {
    console.warn(`Safety: Blocked unauthorized component <${node.component}>`);
    return null; // Correctness: Do not render unauthorized components.
  }

  // 4. Recursive Rendering: Map over children and handle potential Object-as-Child errors.
  const renderChildren = (children) => {
    if (!children) return null;

    if (Array.isArray(children)) {
      return children.map((child, i) => {
        // If it's a valid nested component node, recurse
        if (typeof child === 'object' && child !== null && child.component) {
          return <UIRenderer key={i} node={child} />;
        }
        // NEW FIX: If it's a data object (like {label: '...'}), extract the string
        if (typeof child === 'object' && child !== null) {
          return child.label || child.text || child.title || JSON.stringify(child);
        }
        // Fallback for strings/numbers
        return child;
      });
    }

    // Handle single children that might be objects
    if (typeof children === 'object' && children !== null && !children.component) {
      return children.label || children.text || children.title || JSON.stringify(children);
    }

    return children;
  };

  return (
    <Component {...(node.props || {})}>
      {renderChildren(node.children)}
    </Component>
  );
};