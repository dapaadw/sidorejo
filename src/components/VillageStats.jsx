import { Users, Home, UserCheck, UserX, Briefcase, HelpCircle } from 'lucide-react';

export default function VillageStats({ stats }) {
  if (!stats) return null;

  const { kk, laki_laki, perempuan, bekerja, menganggur } = stats;
  const totalPenduduk = (laki_laki || 0) + (perempuan || 0);
  const totalAngkatanKerja = (bekerja || 0) + (menganggur || 0);

  // Calculations
  const persenLakiLaki = totalPenduduk > 0 ? ((laki_laki / totalPenduduk) * 100).toFixed(1) : 0;
  const persenPerempuan = totalPenduduk > 0 ? ((perempuan / totalPenduduk) * 100).toFixed(1) : 0;
  
  const persenBekerja = totalAngkatanKerja > 0 ? ((bekerja / totalAngkatanKerja) * 100).toFixed(1) : 0;
  const persenMenganggur = totalAngkatanKerja > 0 ? ((menganggur / totalAngkatanKerja) * 100).toFixed(1) : 0;

  // SVG Donut properties
  const radius = 60;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Dash offset calculations
  const strokeDashoffsetLakiLaki = circumference - (persenLakiLaki / 100) * circumference;
  const strokeDashoffsetBekerja = circumference - (persenBekerja / 100) * circumference;

  return (
    <div className="space-y-10">
      {/* Visual Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Penduduk */}
        <div className="relative overflow-hidden rounded-[12px] border border-earth-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-leaf-500 uppercase tracking-wider">Total Penduduk</p>
              <h4 className="mt-2 font-display text-3xl font-black text-leaf-955">{totalPenduduk.toLocaleString('id-ID')}</h4>
              <p className="mt-1 text-xs text-leaf-600 font-semibold">Jiwa yang tercatat</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
              <Users size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-leaf-600"></div>
        </div>

        {/* Total KK */}
        <div className="relative overflow-hidden rounded-[12px] border border-earth-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-clay uppercase tracking-wider">Kepala Keluarga (KK)</p>
              <h4 className="mt-2 font-display text-3xl font-black text-leaf-955">{kk.toLocaleString('id-ID')}</h4>
              <p className="mt-1 text-xs text-leaf-600 font-semibold">Keluarga terdaftar</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-earth-100 text-clay">
              <Home size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-clay"></div>
        </div>

        {/* Angkatan Kerja */}
        <div className="relative overflow-hidden rounded-[12px] border border-earth-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Angkatan Kerja</p>
              <h4 className="mt-2 font-display text-3xl font-black text-leaf-955">{totalAngkatanKerja.toLocaleString('id-ID')}</h4>
              <p className="mt-1 text-xs text-leaf-600 font-semibold">Usia produktif kerja</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Briefcase size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-amber-500"></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gender Distribution Chart */}
        <div className="rounded-[12px] border border-earth-100 bg-white/80 p-6 shadow-soft">
          <h4 className="mb-6 font-display text-xl font-black text-leaf-900">Demografi Jenis Kelamin</h4>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            {/* SVG Donut */}
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90">
                {/* Background Ring (represents Female / Rose color) */}
                <circle
                  className="text-pink-100 stroke-current"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                />
                <circle
                  className="text-pink-500 stroke-current"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                />
                {/* Foreground Ring (represents Male / Blue color) */}
                <circle
                  className="text-blue-600 stroke-current transition-all duration-1000 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffsetLakiLaki}
                  strokeLinecap="round"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-leaf-900">{persenLakiLaki}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Laki-laki</span>
              </div>
            </div>

            {/* Details & Legends */}
            <div className="flex-1 space-y-4 w-full">
              <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-600"></span>
                    <span className="text-sm font-bold text-leaf-800">Laki-laki</span>
                  </div>
                  <span className="text-sm font-black text-blue-800">{persenLakiLaki}%</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-blue-600">{laki_laki.toLocaleString('id-ID')} Jiwa</p>
              </div>

              <div className="rounded-lg bg-pink-50/50 p-3 border border-pink-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-pink-500"></span>
                    <span className="text-sm font-bold text-leaf-800">Perempuan</span>
                  </div>
                  <span className="text-sm font-black text-pink-700">{persenPerempuan}%</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-pink-600">{perempuan.toLocaleString('id-ID')} Jiwa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Status Chart */}
        <div className="rounded-[12px] border border-earth-100 bg-white/80 p-6 shadow-soft">
          <h4 className="mb-6 font-display text-xl font-black text-leaf-900">Status Pekerjaan Penduduk</h4>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            {/* SVG Donut */}
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90">
                {/* Background Ring (represents Unemployed / Red color) */}
                <circle
                  className="text-red-100 stroke-current"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                />
                <circle
                  className="text-red-500 stroke-current"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                />
                {/* Foreground Ring (represents Employed / Green color) */}
                <circle
                  className="text-emerald-600 stroke-current transition-all duration-1000 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffsetBekerja}
                  strokeLinecap="round"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-leaf-900">{persenBekerja}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Bekerja</span>
              </div>
            </div>

            {/* Details & Legends */}
            <div className="flex-1 space-y-4 w-full">
              <div className="rounded-lg bg-emerald-50/50 p-3 border border-emerald-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-600"></span>
                    <span className="text-sm font-bold text-leaf-800">Bekerja</span>
                  </div>
                  <span className="text-sm font-black text-emerald-800">{persenBekerja}%</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-emerald-600">{bekerja.toLocaleString('id-ID')} Jiwa</p>
              </div>

              <div className="rounded-lg bg-red-50/50 p-3 border border-red-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="text-sm font-bold text-leaf-800">Menganggur</span>
                  </div>
                  <span className="text-sm font-black text-red-700">{persenMenganggur}%</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-red-600">{menganggur.toLocaleString('id-ID')} Jiwa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
