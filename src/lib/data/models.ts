export type ProjectId = 'webstudio-creator';
export type Role = 'customer' | 'admin';
export type OrderStatus =
  'requested' | 'confirmed' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
export interface RecordBase {
  id: string;
  project_id: ProjectId;
  created_at: string;
}
export interface Profile extends RecordBase {
  user_id: string;
  display_name: string;
  creator_name: string;
  locale: 'de' | 'en';
}
export interface Session {
  userId: string;
  projectId: ProjectId;
  role: Role;
}
export interface Order extends RecordBase {
  customer_id: string;
  reference: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  price_version: string;
  once_cents: number;
  monthly_cents: number;
  deposit_cents: number;
  remainder_cents: number;
}
export interface OrderItem extends RecordBase {
  order_id: string;
  product_id: string;
  option_id: string | null;
  quantity: number;
  amount_cents: number;
  period: 'once' | 'monthly';
  scope_snapshot: unknown;
}
export interface Lead extends RecordBase {
  owner_id: string | null;
  name: string;
  email: string;
  stage: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
}
export interface Message extends RecordBase {
  order_id: string;
  sender_id: string;
  body: string;
  internal: boolean;
}
export interface ProjectFile extends RecordBase {
  order_id: string;
  uploader_id: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
}
export interface Revision extends RecordBase {
  order_id: string;
  customer_id: string;
  body: string;
  status: 'open' | 'resolved';
}
export interface Approval extends RecordBase {
  order_id: string;
  customer_id: string;
  approved_version: string;
}
export interface Invoice extends RecordBase {
  customer_id: string;
  order_id: string;
  number: string;
  total_cents: number;
  status: 'draft' | 'issued' | 'paid' | 'void';
}
export interface Payment extends RecordBase {
  order_id: string;
  invoice_id: string | null;
  amount_cents: number;
  method: 'bank' | 'invoice' | 'crypto';
  status: PaymentStatus;
  verified_by: string | null;
  verified_at: string | null;
}
export interface Subscription extends RecordBase {
  customer_id: string;
  order_id: string;
  monthly_cents: number;
  status: 'pending' | 'active' | 'cancelled';
  activated_at: string | null;
  cancelled_at: string | null;
}
export interface Ticket extends RecordBase {
  customer_id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
}
export interface EmailTemplate extends RecordBase {
  key: string;
  locale: 'de' | 'en';
  subject: string;
  body: string;
}
export interface EmailLog extends RecordBase {
  customer_id: string | null;
  reference: string;
  kind: string;
  status: 'pending' | 'accepted' | 'failed';
  provider_id: string | null;
}
export interface PriceOption extends RecordBase {
  product_id: string;
  key: string;
  amount_cents: number;
  period: 'once' | 'monthly';
  max_quantity: number;
  active: boolean;
}
export interface ServiceRecord extends RecordBase {
  slug: string;
  kind: 'service' | 'package';
  scope: unknown;
  active: boolean;
}
export interface ProjectSettings extends RecordBase {
  key: string;
  value: unknown;
}
export interface AuditEvent extends RecordBase {
  actor_id: string;
  action: string;
  entity_id: string;
  metadata: unknown;
}
