-- CI'daki düz Postgres servisinde Supabase'in "auth" şeması ve
-- anon/authenticated rolleri yok. RLS migration'ı ikisini de kullandığı
-- için (auth.uid(), GRANT ... TO anon, authenticated), yalnızca CI'de
-- (build'in DB'ye bağlanabilmesi için) minimal bir uyumluluk shim'i
-- uygulanır. Gerçek Supabase projelerinde bu dosya HİÇBİR ZAMAN
-- çalıştırılmaz/gerekmez.
create schema if not exists auth;

create or replace function auth.uid() returns uuid
language sql
stable
as $$
  select null::uuid
$$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
end
$$;
