import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
test('prepared migration executes and RLS isolates customers, admin data and payment writes', async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
    );
    await db.exec(await readFile('supabase/migrations/202610190001_creator_schema.sql', 'utf8'));
    await db.exec(`insert into auth.users values ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002'),('00000000-0000-0000-0000-000000000003');
 insert into webstudio_creator.memberships(user_id,role) values ('00000000-0000-0000-0000-000000000001','customer'),('00000000-0000-0000-0000-000000000002','customer'),('00000000-0000-0000-0000-000000000003','admin');
 insert into webstudio_creator.profiles(id,user_id,display_name) values ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Alice'),('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Bob');
 insert into webstudio_creator.price_versions(version,catalog) values('test','{}');
 insert into webstudio_creator.orders(id,customer_id,reference,price_version,once_cents,monthly_cents,deposit_cents,remainder_cents) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','WC-A','test',10000,0,5000,5000),('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','WC-B','test',10000,0,5000,5000);
 insert into webstudio_creator.messages(order_id,sender_id,body,internal) values('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','Public reply',false),('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','Private admin note',true);
 insert into webstudio_creator.leads(name,email) values('Private lead','private@example.com');
 set role authenticated;set request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';`);
    assert.equal((await db.query('select * from webstudio_creator.orders')).rows.length, 1);
    assert.equal((await db.query('select * from webstudio_creator.profiles')).rows.length, 1);
    assert.equal((await db.query('select * from webstudio_creator.messages')).rows.length, 1);
    assert.equal((await db.query('select * from webstudio_creator.leads')).rows.length, 0);
    await assert.rejects(() =>
      db.exec(`insert into webstudio_creator.memberships(user_id,role) values(auth.uid(),'admin')`),
    );
    assert.equal(
      (await db.query(`update webstudio_creator.orders set payment_status='paid' returning id`))
        .rows.length,
      0,
    );
    await assert.rejects(() =>
      db.exec(
        `insert into webstudio_creator.messages(order_id,sender_id,body) values('20000000-0000-0000-0000-000000000002',auth.uid(),'Cross-account write')`,
      ),
    );
    await assert.rejects(() =>
      db.exec(
        `insert into webstudio_creator.messages(order_id,sender_id,body,internal) values('20000000-0000-0000-0000-000000000001',auth.uid(),'Hidden note',true)`,
      ),
    );
    await db.exec(`set request.jwt.claim.sub='00000000-0000-0000-0000-000000000003'`);
    assert.equal((await db.query('select * from webstudio_creator.orders')).rows.length, 2);
    assert.equal((await db.query('select * from webstudio_creator.messages')).rows.length, 2);
    assert.equal((await db.query('select * from webstudio_creator.leads')).rows.length, 1);
    await assert.rejects(() =>
      db.exec(
        `insert into webstudio_creator.profiles(project_id,user_id,display_name) values('webstudio-expert','00000000-0000-0000-0000-000000000003','Forbidden project')`,
      ),
    );
    await assert.rejects(() =>
      db.exec(
        `insert into webstudio_creator.payments(order_id,amount_cents,method,status) values('20000000-0000-0000-0000-000000000001',10000,'bank','paid')`,
      ),
    );
    const rls = await db.query<{ count: number }>(
      `select count(*)::int as count from pg_tables where schemaname='webstudio_creator' and not rowsecurity`,
    );
    assert.equal(rls.rows[0].count, 0);
  } finally {
    await db.close();
  }
});
