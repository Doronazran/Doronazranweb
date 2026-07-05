// Plain page container. The route-level enter animation lives in App.jsx
// (a single keyed motion.div), so individual pages don't need their own.
export default function Page({ children }) {
  return <div className="page">{children}</div>
}
