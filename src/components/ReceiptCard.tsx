"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  torn?: "bottom" | "top" | "none";
  wide?: boolean;
  style?: React.CSSProperties;
};

export function ReceiptCard({
  children,
  className = "",
  torn = "bottom",
  wide = false,
  style,
}: Props) {
  const tear =
    torn === "bottom" ? "paper-torn" : torn === "top" ? "paper-torn-top" : "";
  return (
    <article
      className={`paper relative ${tear} ${
        wide ? "w-full max-w-xl" : "w-full max-w-[360px]"
      } mx-auto px-5 pt-5 pb-8 ${className}`}
      style={style}
    >
      {children}
    </article>
  );
}

export function DottedRow({
  left,
  right,
  highlight = false,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`ledger-row font-[family-name:var(--font-mono)] text-[12px] sm:text-[13px] leading-snug py-1 ${
        highlight ? "bg-[#f4d03f]/70 -mx-2 px-2 rounded-sm" : ""
      }`}
    >
      <div className="flex items-end min-w-0">
        <span className="shrink">{left}</span>
        <span className="fill flex-1" />
      </div>
      <span className="text-right whitespace-nowrap font-medium">{right}</span>
    </div>
  );
}
