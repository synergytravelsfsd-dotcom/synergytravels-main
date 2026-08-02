export const BRAND_NAME = 'Synergy Travels & Tour';

export const CONTACT = {
  phone: '+44 7466441212',
  phoneDigits: '447466441212',
  email: 'info@synergytravelsandtour.com',
} as const;

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function getEmailLink(subject: string, body: string): string {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getContactLinks(message: string, subject = `Booking Enquiry - ${BRAND_NAME}`) {
  return {
    whatsapp: getWhatsAppLink(message),
    email: getEmailLink(subject, message),
  };
}
