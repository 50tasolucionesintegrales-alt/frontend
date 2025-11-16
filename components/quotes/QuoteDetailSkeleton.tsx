export default function QuoteDetailSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Esqueleto del Head de la tabla */}
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-1/3 rounded bg-gray-300 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-1/4 rounded bg-gray-300 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-1/4 rounded bg-gray-300 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-right">
                <div className="h-4 w-1/2 ml-auto rounded bg-gray-300 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          {/* Esqueleto del Body de la tabla */}
          <tbody className="divide-y divide-gray-200">
            {/* Puedes repetir esto varias veces para simular filas */}
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="h-4 w-3/4 ml-auto rounded bg-gray-200"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}