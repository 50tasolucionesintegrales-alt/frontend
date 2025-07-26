
export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{children}</p>
  )
}
