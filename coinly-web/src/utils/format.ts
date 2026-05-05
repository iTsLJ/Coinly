// Funções utilitárias para máscaras e formatação

export function onlyDigits(value: string): string {
  return (value || '').replace(/\D/g, '')
}

export function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskCnpj(value: string): string {
  const digits = onlyDigits(value).slice(0, 14)
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

// Formata CPF para exibição em tabela (11 dígitos -> 000.000.000-00)
export function formatCpf(cpf: string): string {
  const digits = onlyDigits(cpf)
  if (digits.length !== 11) return cpf
  return maskCpf(digits)
}

export function formatCnpj(cnpj: string): string {
  const digits = onlyDigits(cnpj)
  if (digits.length !== 14) return cnpj
  return maskCnpj(digits)
}

// Validação básica de CPF (mesma lógica do CpfValidator do backend)
export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf)
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i)
  let check = (sum * 10) % 11
  if (check === 10) check = 0
  if (check !== Number(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i)
  check = (sum * 10) % 11
  if (check === 10) check = 0
  return check === Number(digits[10])
}

// Validação básica de CNPJ
export function isValidCnpj(cnpj: string): boolean {
  const digits = onlyDigits(cnpj)
  if (digits.length !== 14) return false
  if (/^(\d)\1{13}$/.test(digits)) return false

  const calc = (base: string, weights: number[]) => {
    const sum = weights.reduce((acc, w, i) => acc + Number(base[i]) * w, 0)
    const mod = sum % 11
    return mod < 2 ? 0 : 11 - mod
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const d1 = calc(digits.substring(0, 12), w1)
  const d2 = calc(digits.substring(0, 12) + d1, w2)

  return d1 === Number(digits[12]) && d2 === Number(digits[13])
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
