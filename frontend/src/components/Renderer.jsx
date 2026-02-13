// frontend/src/components/Renderer.jsx
import React from 'react';
import { ComponentMap } from './ComponentMap';

export const UIRenderer = ({ node }) => {
  if (!node) return null;

  const Component = ComponentMap[node.component];

  if (!Component) {
    return <div className="text-red-500">Unknown component: {node.component}</div>;
  }

  return (
    <Component {...node.props}>
      {node.children && Array.isArray(node.children) 
        ? node.children.map((child, i) => <UIRenderer key={i} node={child} />)
        : node.children}
    </Component>
  );
};