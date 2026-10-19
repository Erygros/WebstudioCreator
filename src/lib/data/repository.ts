import type {
  Session,
  Order,
  Profile,
  Message,
  ProjectFile,
  Ticket,
  Invoice,
  Subscription,
  Lead,
  Payment,
  Revision,
  Approval,
} from './models';
// Future adapters must verify a real server session before creating this context.
// Never trust a role supplied by the browser or user-editable auth metadata.
export interface CreatorRepository {
  readonly available: boolean;
  getVerifiedSession(): Promise<Session | null>;
  getProfile(session: Session): Promise<Profile>;
  listOrders(session: Session): Promise<Order[]>;
  getOrder(session: Session, id: string): Promise<Order | null>;
  listMessages(session: Session, orderId: string): Promise<Message[]>;
  listFiles(session: Session, orderId: string): Promise<ProjectFile[]>;
  listInvoices(session: Session): Promise<Invoice[]>;
  listSubscriptions(session: Session): Promise<Subscription[]>;
  listTickets(session: Session): Promise<Ticket[]>;
  listRevisions(session: Session, orderId: string): Promise<Revision[]>;
  listApprovals(session: Session, orderId: string): Promise<Approval[]>;
  listLeads(session: Session): Promise<Lead[]>;
  listPayments(session: Session): Promise<Payment[]>;
}
export class IntegrationUnavailableError extends Error {
  constructor() {
    super('Supabase integration is not connected');
    this.name = 'IntegrationUnavailableError';
  }
}
const disabled = async (): Promise<never> => {
  throw new IntegrationUnavailableError();
};
export const repository: CreatorRepository = {
  available: false,
  getVerifiedSession: async () => null,
  getProfile: disabled,
  listOrders: disabled,
  getOrder: disabled,
  listMessages: disabled,
  listFiles: disabled,
  listInvoices: disabled,
  listSubscriptions: disabled,
  listTickets: disabled,
  listRevisions: disabled,
  listApprovals: disabled,
  listLeads: disabled,
  listPayments: disabled,
};
export function assertPermission(
  session: Session | null,
  permission: 'customer' | 'admin',
): asserts session is Session {
  if (
    !session ||
    session.projectId !== 'webstudio-creator' ||
    (permission === 'admin' && session.role !== 'admin')
  )
    throw new Error('Forbidden');
}
