import { useEffect, useState, useRef, useCallback } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  /** Container element to query headings from (default: article main content) */
  contentSelector?: string;
  /** Manually provided items (bypasses DOM scanning) */
  items?: TocItem[];
  className?: string;
}

/** Convert heading text to a URL-safe ID */
export function textToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Scan a container for h2/h3 headings and return TocItem[] */
export function scanHeadings(container: Element): TocItem[] {
  const nodes = container.querySelectorAll<HTMLHeadingElement>("h2, h3");
  return Array.from(nodes)
    .filter((node) => node.textContent?.trim())
    .map((node) => {
      const text = node.textContent?.trim() || "";
      const id = node.id || textToId(text);
      if (!node.id) node.id = id; // inject ID so anchoring works
      return {
        id,
        text,
        level: parseInt(node.tagName[1]) as 2 | 3,
      };
    });
}

const TableOfContents = ({
  contentSelector = "[data-article-content]",
  items: providedItems,
}: TableOfContentsProps) => {
  const [items, setItems] = useState<TocItem[]>(providedItems || []);
  const [activeId, setActiveId] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scan DOM for headings if items not provided
  useEffect(() => {
    if (providedItems?.length) return;
    const el = document.querySelector(contentSelector);
    if (!el) return;

    // Allow time for content to render
    const t = setTimeout(() => {
      const found = scanHeadings(el);
      setItems(found);
      if (found.length > 0) setActiveId(found[0].id);
    }, 100);
    return () => clearTimeout(t);
  }, [contentSelector, providedItems]);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    if (items.length === 0) return;
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -80% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80; // offset for sticky nav
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  }, []);

  if (items.length < 2) return null; // not worth showing for < 2 headings

  return (
    <nav
      aria-label="Table of contents"
      data-testid="table-of-contents"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(212,175,55,0.12)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "32px",
        position: "sticky",
        top: "80px",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls="toc-list"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderBottom: collapsed ? "none" : "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <List size={14} style={{ color: "rgba(212,175,55,0.7)" }} aria-hidden="true" />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(253,230,138,0.75)",
            }}
          >
            Contents
          </span>
        </div>
        {collapsed ? (
          <ChevronDown size={14} style={{ color: "rgba(42,31,14,0.4)" }} aria-hidden="true" />
        ) : (
          <ChevronUp size={14} style={{ color: "rgba(42,31,14,0.4)" }} aria-hidden="true" />
        )}
      </button>

      {/* List */}
      {!collapsed && (
        <ol
          id="toc-list"
          style={{ listStyle: "none", padding: "8px 0 10px", margin: 0 }}
        >
          {items.map((item, i) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: `6px ${item.level === 3 ? "32px" : "18px"} 6px 18px`,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s",
                    color: isActive ? "rgba(212,175,55,0.95)" : "rgba(42,31,14,0.7)",
                  }}
                >
                  {/* Active indicator dot */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: isActive ? "#D4AF37" : "transparent",
                      border: isActive ? "none" : "1px solid rgba(42,31,14,0.2)",
                      transition: "all 0.2s",
                    }}
                  />
                  <span
                    style={{
                      fontSize: item.level === 3 ? "12px" : "13px",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      lineHeight: 1.4,
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {i + 1}. {item.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
};

export default TableOfContents;
