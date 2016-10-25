import React from 'react';

const toPrefetch = [
  '/assets/1.chunk.js',
];

export default function Prefetch() {
  return (
    <div style={{display: 'none'}}>
      {toPrefetch.map((asset, index) => (
        <link key={index} href={asset} rel="prefetch" as="script" />
      ))}
    </div>
  );
}
