import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

export function DocPageLayout({ breadcrumbs, title, lead, children, toc = [] }) {
  const [activeId, setActiveId] = useState(toc.length > 0 ? toc[0].id : '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Sort by top coordinate to get the highest visible element
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="flex gap-12 max-w-[1400px] mx-auto">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pb-24">
        {/* Header Area */}
        {breadcrumbs && (
          <div className="flex items-center gap-2 text-sm text-[#a3a3a3] mb-4">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <span className={i === breadcrumbs.length - 1 ? 'text-white' : ''}>{b}</span>
                {i < breadcrumbs.length - 1 && <ChevronRight size={14} />}
              </React.Fragment>
            ))}
          </div>
        )}
        {title && <h1 className="text-[2.5rem] leading-tight font-bold text-white mb-4">{title}</h1>}
        {lead && <p className="text-xl leading-relaxed text-[#a3a3a3] mb-10">{lead}</p>}

        {children}
      </div>

      {/* Right Table of Contents */}
      {toc.length > 0 && (
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <List size={16} color="#a3a3a3" />
              On this page
            </div>
            <nav className="border-l border-[#2a2a2a] flex flex-col">
              {toc.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`pl-4 py-1.5 text-sm transition-colors border-l-[2px] -ml-[1px] ${
                      isActive ? 'border-white text-white font-medium' : 'border-transparent text-[#a3a3a3] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export function DocNumberedHeading({ number, id, children }) {
  return (
    <div id={id} className="flex items-center gap-4 mt-14 mb-6 pt-4 scroll-mt-6">
      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center font-bold text-sm shrink-0">
        {number}
      </div>
      <h2 className="text-2xl font-semibold text-white">{children}</h2>
    </div>
  );
}

export function DocHeading({ id, children }) {
  return (
    <h1 id={id} className="text-[2rem] leading-tight font-bold text-white mb-6 pt-2 scroll-mt-6">
      {children}
    </h1>
  );
}

export function DocSubheading({ id, children }) {
  return (
    <h2
      id={id}
      className="text-2xl font-semibold text-white mt-14 mb-5 pb-2 border-b scroll-mt-6"
      style={{ borderColor: '#2a2a2a' }}
    >
      {children}
    </h2>
  );
}

export function DocH3({ id, children }) {
  return (
    <h3 id={id} className="text-lg font-semibold text-white mt-8 mb-3">
      {children}
    </h3>
  );
}

export function DocParagraph({ children }) {
  return (
    <p className="text-base leading-7 mb-5" style={{ color: '#d1d5db' }}>
      {children}
    </p>
  );
}

export function DocCode({ children }) {
  return (
    <pre
      className="text-sm font-mono p-5 rounded-xl mb-6 overflow-x-auto"
      style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', color: '#c9d1d9' }}
    >
      <code>{children}</code>
    </pre>
  );
}

export function DocCallout({ type = 'info', children }) {
  const colors = {
    info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', label: 'Note', labelColor: '#60a5fa' },
    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Important', labelColor: '#fbbf24' },
    tip: { bg: 'rgba(16,163,127,0.08)', border: 'rgba(16,163,127,0.2)', label: 'Tip', labelColor: '#34d399' },
  };
  const c = colors[type] || colors.info;
  return (
    <div
      className="px-5 py-4 rounded-xl mb-6 text-base"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <p className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: c.labelColor }}>
        {c.label}
      </p>
      <div style={{ color: '#d1d5db' }} className="leading-7">{children}</div>
    </div>
  );
}

export function DocList({ items }) {
  return (
    <ul className="space-y-2.5 mb-6 pl-4">
      {items.map((item, i) => (
        <li key={i} className="text-base flex items-start gap-3" style={{ color: '#d1d5db' }}>
          <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#666' }} />
          <span className="leading-7">{item}</span>
        </li>
      ))}
    </ul>
  );
}
