export interface EmailSignature {
  id: string;
  fullName: string;
  role: string | null;
  phone: string | null;
  email: string;
  website: string | null;
  address: string | null;
  logoUrl: string | null;
  accentColor: string | null;
  html: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSignatureForm {
  fullName: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logoUrl: string;
  accentColor: string;
}

export interface EmailTemplate {
  id: string;
  templateKey: string;
  subject: string;
  bodyHtml: string;
  createdAt: string;
  updatedAt: string;
}
