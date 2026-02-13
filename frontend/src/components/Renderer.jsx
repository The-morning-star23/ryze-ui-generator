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
        // If the child is a valid nested component node
        if (typeof child === 'object' && child !== null && child.component) {
          return <UIRenderer key={i} node={child} />;
        }
        // If the child is an object with text (fixes React Error #31)
        if (typeof child === 'object' && child !== null) {
          return child.text || child.label || JSON.stringify(child);
        }
        // Fallback for strings/numbers
        return child;
      });
    }

    // Handle single children that might be objects
    if (typeof children === 'object' && children !== null && !children.component) {
      return children.text || children.label || JSON.stringify(children);
    }

    return children;
  };

  return (
    <Component {...(node.props || {})}>
      {renderChildren(node.children)}
    </Component>
  );
};