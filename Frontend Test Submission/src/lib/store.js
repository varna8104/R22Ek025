const KEY = 'urls'
export function getAll() {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}
export function setAll(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr))
}
export function add(item) {
  const all = getAll()
  all.unshift(item)
  setAll(all)
}
