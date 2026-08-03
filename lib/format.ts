export function formatIQD(amount: number): string {
  try {
    return new Intl.NumberFormat('ar-IQ').format(Math.round(amount));
  } catch {
    return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

export function formatDateAr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('964') && digits.length >= 13) {
    return `+964 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}
