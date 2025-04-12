export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `${src}?${paramsString}`
}
