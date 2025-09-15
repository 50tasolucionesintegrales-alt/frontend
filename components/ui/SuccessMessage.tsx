export default function SuccessMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{children}</p>
  )
}
