export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[8px] border border-earth-100 bg-white/78 p-5 shadow-soft">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
        <Icon size={24} />
      </div>
      <p className="font-display text-3xl font-black text-leaf-900">{value}</p>
      <p className="mt-1 text-sm font-bold text-earth-700">{label}</p>
    </div>
  );
}
