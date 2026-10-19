-- PREPARED ONLY. Apply to a dedicated Creator Supabase project after review.
-- Never run against an existing Webstudio Expert database.
begin;
create schema if not exists webstudio_creator;
revoke all on schema webstudio_creator from public;
grant usage on schema webstudio_creator to authenticated, service_role;

create table webstudio_creator.memberships (
 id uuid primary key default gen_random_uuid(),
 project_id text not null default 'webstudio-creator' check (project_id = 'webstudio-creator'),
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null default 'customer' check (role in ('customer','admin')),
 created_at timestamptz not null default now(), unique(project_id,user_id)
);
-- Memberships are provisioned only by a trusted server/service-role process.
create function webstudio_creator.is_admin() returns boolean language sql stable security definer
set search_path = '' as $$
 select exists(select 1 from webstudio_creator.memberships where user_id=auth.uid() and project_id='webstudio-creator' and role='admin');
$$;
revoke all on function webstudio_creator.is_admin() from public;
grant execute on function webstudio_creator.is_admin() to authenticated, service_role;
alter table webstudio_creator.memberships enable row level security;
create policy membership_read on webstudio_creator.memberships for select to authenticated using (user_id=auth.uid() or webstudio_creator.is_admin());

create table webstudio_creator.profiles (
 id uuid primary key default gen_random_uuid(),
 project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 user_id uuid not null references auth.users(id) on delete cascade,
 display_name text not null, creator_name text not null default '', locale text not null default 'de' check(locale in ('de','en')),
 created_at timestamptz not null default now(), unique(project_id,id),unique(project_id,user_id)
);
create table webstudio_creator.services (
 id uuid primary key default gen_random_uuid(),
 project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 slug text not null,kind text not null check(kind in ('service','package')),scope jsonb not null default '{}',active boolean not null default false,
 created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,slug)
);
create table webstudio_creator.price_versions (
 id uuid primary key default gen_random_uuid(),
 project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 version text not null,catalog jsonb not null,published_at timestamptz,
 created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,version)
);
create table webstudio_creator.price_options (
 id uuid primary key default gen_random_uuid(),
 project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 product_id uuid not null,key text not null,amount_cents integer not null check(amount_cents>=0),period text not null check(period in ('once','monthly')),
 max_quantity integer not null check(max_quantity between 1 and 20),active boolean not null default false,
 created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,product_id,key),
 foreign key(project_id,product_id) references webstudio_creator.services(project_id,id)
);
create table webstudio_creator.orders (
 id uuid primary key default gen_random_uuid(),
 project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 customer_id uuid not null,reference text not null check(reference like 'WC-%'),
 status text not null default 'requested' check(status in ('requested','confirmed','in_progress','review','completed','cancelled')),
 payment_status text not null default 'unpaid' check(payment_status in ('unpaid','partially_paid','paid','refunded')),
 price_version text not null,once_cents integer not null check(once_cents>=0),monthly_cents integer not null check(monthly_cents>=0),
 deposit_cents integer not null check(deposit_cents>=0),remainder_cents integer not null check(remainder_cents>=0),briefing jsonb not null default '{}',
 created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,reference),
 check(deposit_cents+remainder_cents=once_cents),foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id),
 foreign key(project_id,price_version) references webstudio_creator.price_versions(project_id,version)
);
create index orders_customer_idx on webstudio_creator.orders(customer_id,created_at desc);
create table webstudio_creator.order_items (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 order_id uuid not null,product_id uuid not null,option_id uuid,quantity integer not null check(quantity between 1 and 20),amount_cents integer not null check(amount_cents>=0),
 period text not null check(period in ('once','monthly')),scope_snapshot jsonb not null,created_at timestamptz not null default now(),unique(project_id,id),
 foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id),foreign key(project_id,product_id) references webstudio_creator.services(project_id,id),
 foreign key(project_id,option_id) references webstudio_creator.price_options(project_id,id)
);
create table webstudio_creator.leads (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 owner_id uuid references auth.users(id),name text not null,email text not null,stage text not null default 'new' check(stage in ('new','contacted','qualified','won','lost')),
 notes text not null default '',created_at timestamptz not null default now(),unique(project_id,id)
);
create table webstudio_creator.messages (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 order_id uuid not null,sender_id uuid not null references auth.users(id),body text not null check(length(body) between 1 and 8000),internal boolean not null default false,
 created_at timestamptz not null default now(),unique(project_id,id),foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id)
);
create table webstudio_creator.files (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 order_id uuid not null,uploader_id uuid not null references auth.users(id),storage_path text not null,mime_type text not null,size_bytes bigint not null check(size_bytes between 1 and 104857600),
 created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,storage_path),foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id)
);
create table webstudio_creator.revisions (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 order_id uuid not null,customer_id uuid not null,body text not null,status text not null default 'open' check(status in ('open','resolved')),
 created_at timestamptz not null default now(),unique(project_id,id),foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id),
 foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id)
);
create table webstudio_creator.approvals (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 order_id uuid not null,customer_id uuid not null,approved_version text not null,
 created_at timestamptz not null default now(),unique(project_id,id),foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id),
 foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id)
);
create table webstudio_creator.invoices (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 customer_id uuid not null,order_id uuid not null,number text not null check(number like 'WC-INV-%'),total_cents integer not null check(total_cents>=0),
 status text not null default 'draft' check(status in ('draft','issued','paid','void')),created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,number),
 foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id),foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id)
);
create table webstudio_creator.payments (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 order_id uuid not null,invoice_id uuid,amount_cents integer not null check(amount_cents>0),method text not null check(method in ('bank','invoice','crypto')),
 status text not null default 'unpaid' check(status in ('unpaid','partially_paid','paid','refunded')),
 verified_by uuid references auth.users(id),verified_at timestamptz,created_at timestamptz not null default now(),unique(project_id,id),
 check(status not in ('partially_paid','paid') or (verified_by is not null and verified_at is not null)),
 foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id),foreign key(project_id,invoice_id) references webstudio_creator.invoices(project_id,id)
);
create table webstudio_creator.subscriptions (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 customer_id uuid not null,order_id uuid not null,monthly_cents integer not null check(monthly_cents>0),status text not null default 'pending' check(status in ('pending','active','cancelled')),
 activated_at timestamptz,cancelled_at timestamptz,created_at timestamptz not null default now(),unique(project_id,id),check(status<>'active' or activated_at is not null),
 foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id),foreign key(project_id,order_id) references webstudio_creator.orders(project_id,id)
);
create table webstudio_creator.tickets (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 customer_id uuid not null,subject text not null,status text not null default 'open' check(status in ('open','in_progress','closed')),
 created_at timestamptz not null default now(),unique(project_id,id),foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id)
);
create table webstudio_creator.ticket_messages (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 ticket_id uuid not null,sender_id uuid not null references auth.users(id),body text not null,internal boolean not null default false,
 created_at timestamptz not null default now(),unique(project_id,id),foreign key(project_id,ticket_id) references webstudio_creator.tickets(project_id,id)
);
create table webstudio_creator.email_templates (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 key text not null,locale text not null check(locale in ('de','en')),subject text not null,body text not null,
 created_at timestamptz not null default now(),unique(project_id,id),unique(project_id,key,locale)
);
create table webstudio_creator.email_logs (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 customer_id uuid,reference text not null,kind text not null,status text not null default 'pending' check(status in ('pending','accepted','failed')),provider_id text,
 created_at timestamptz not null default now(),unique(project_id,id),foreign key(project_id,customer_id) references webstudio_creator.profiles(project_id,id)
);
create table webstudio_creator.settings (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 key text not null,value jsonb not null,created_at timestamptz not null default now(),unique(project_id,key)
);
-- Settings must never store plaintext SMTP passwords/private payment keys.
create table webstudio_creator.audit_events (
 id uuid primary key default gen_random_uuid(),project_id text not null default 'webstudio-creator' check(project_id='webstudio-creator'),
 actor_id uuid not null references auth.users(id),action text not null,entity_id uuid not null,metadata jsonb not null default '{}',created_at timestamptz not null default now()
);

create function webstudio_creator.owns_profile(profile_id uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from webstudio_creator.profiles where id=profile_id and user_id=auth.uid() and project_id='webstudio-creator');
$$;
create function webstudio_creator.owns_order(target_order uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from webstudio_creator.orders o join webstudio_creator.profiles p on p.id=o.customer_id and p.project_id=o.project_id where o.id=target_order and p.user_id=auth.uid() and o.project_id='webstudio-creator');
$$;
create function webstudio_creator.owns_ticket(target_ticket uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from webstudio_creator.tickets t join webstudio_creator.profiles p on p.id=t.customer_id and p.project_id=t.project_id where t.id=target_ticket and p.user_id=auth.uid() and t.project_id='webstudio-creator');
$$;
revoke all on function webstudio_creator.owns_profile(uuid),webstudio_creator.owns_order(uuid),webstudio_creator.owns_ticket(uuid) from public;
grant execute on function webstudio_creator.owns_profile(uuid),webstudio_creator.owns_order(uuid),webstudio_creator.owns_ticket(uuid) to authenticated, service_role;

-- All tables default-deny. Admin access derives from protected membership rows.
do $$ declare t text; begin
 foreach t in array array['profiles','services','price_versions','price_options','orders','order_items','leads','messages','files','revisions','approvals','invoices','payments','subscriptions','tickets','ticket_messages','email_templates','email_logs','settings','audit_events'] loop
 execute format('alter table webstudio_creator.%I enable row level security',t);
 execute format('create policy admin_all on webstudio_creator.%I for all to authenticated using (webstudio_creator.is_admin()) with check (project_id=''webstudio-creator'' and webstudio_creator.is_admin())',t);
 end loop;
end $$;
create policy profile_read on webstudio_creator.profiles for select to authenticated using(user_id=auth.uid());
create policy profile_edit on webstudio_creator.profiles for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid() and project_id='webstudio-creator');
create policy order_read on webstudio_creator.orders for select to authenticated using(webstudio_creator.owns_profile(customer_id));
create policy item_read on webstudio_creator.order_items for select to authenticated using(webstudio_creator.owns_order(order_id));
create policy message_read on webstudio_creator.messages for select to authenticated using(not internal and webstudio_creator.owns_order(order_id));
create policy message_send on webstudio_creator.messages for insert to authenticated with check(sender_id=auth.uid() and not internal and webstudio_creator.owns_order(order_id));
create policy file_read on webstudio_creator.files for select to authenticated using(webstudio_creator.owns_order(order_id));
create policy revision_read on webstudio_creator.revisions for select to authenticated using(webstudio_creator.owns_order(order_id) and webstudio_creator.owns_profile(customer_id));
create policy approval_read on webstudio_creator.approvals for select to authenticated using(webstudio_creator.owns_order(order_id) and webstudio_creator.owns_profile(customer_id));
create policy invoice_read on webstudio_creator.invoices for select to authenticated using(status<>'draft' and webstudio_creator.owns_profile(customer_id) and webstudio_creator.owns_order(order_id));
create policy payment_read on webstudio_creator.payments for select to authenticated using(webstudio_creator.owns_order(order_id));
create policy subscription_read on webstudio_creator.subscriptions for select to authenticated using(webstudio_creator.owns_profile(customer_id) and webstudio_creator.owns_order(order_id));
create policy ticket_read on webstudio_creator.tickets for select to authenticated using(webstudio_creator.owns_profile(customer_id));
create policy ticket_message_read on webstudio_creator.ticket_messages for select to authenticated using(not internal and webstudio_creator.owns_ticket(ticket_id));
create policy ticket_message_send on webstudio_creator.ticket_messages for insert to authenticated with check(sender_id=auth.uid() and not internal and webstudio_creator.owns_ticket(ticket_id));

grant select on all tables in schema webstudio_creator to authenticated;
grant insert,update,delete on all tables in schema webstudio_creator to authenticated;
-- No self promotion even with a valid authenticated session.
revoke insert,update,delete on webstudio_creator.memberships from authenticated;
-- Audit history is append-only, including for admins.
revoke update,delete on webstudio_creator.audit_events from authenticated;
grant all on all tables in schema webstudio_creator to service_role;
commit;
