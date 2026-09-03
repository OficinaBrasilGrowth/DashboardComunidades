// Reaproveitado entre BrandSelect e MultiSelect — a mesma lógica de
// busca sem acento seria duplicada entre os dois.
//
// Usa escapes \u de propósito, não o caractere acentuado literal —
// caracteres não-ASCII crus num regex de normalize() são uma fonte
// conhecida de bugs sutis dependendo do encoding do arquivo fonte.

export function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
