export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-2 text-sm font-black uppercase tracking-[0.22em] text-clay">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-black text-leaf-900 sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-8 text-leaf-700">{children}</p>}
    </div>
  );
}
