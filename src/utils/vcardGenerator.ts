/**
 * 📇 vCard Generator
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: توليد ملف vCard جاهز للتحميل من معلومات بطاقة العميل
 * 📌 الصيغة: vCard 3.0
 * ────────────────────────────────────────────────────────────────
 */

interface VCardData {
  name: string;
  jobTitle?: string;
  company?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  website1?: string;
  website2?: string;
  googleMapsLocation?: string;
  photo?: string;
}

export function generateVCard(data: VCardData): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    data.jobTitle ? `TITLE:${data.jobTitle}` : '',
    data.company ? `ORG:${data.company}` : '',
    `TEL;TYPE=WORK,VOICE:${data.phone}`,
    data.whatsapp ? `TEL;TYPE=WHATSAPP:${data.whatsapp}` : '',
    data.email ? `EMAIL:${data.email}` : '',
    data.website1 ? `URL:${data.website1}` : '',
    data.website2 ? `URL:${data.website2}` : '',
    data.googleMapsLocation ? `GEO:${data.googleMapsLocation}` : '',
    'END:VCARD'
  ];

  // إزالة الأسطر الفارغة
  return vcard.filter(line => line && line.trim()).join('\r\n');
}

export function downloadVCard(data: VCardData, filename: string = 'contact'): void {
  const vcardContent = generateVCard(data);
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
