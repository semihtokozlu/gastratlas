-- CI'daki düz Postgres servisinde Supabase'in "auth" şeması yok.
-- RLS migration'ı auth.uid() kullandığı için, yalnızca CI'de (build'in DB'ye
-- bağlanabilmesi için) minimal bir uyumluluk shim'i uygulanır. Gerçek
-- Supabase projelerinde bu dosya HİÇBİR ZAMAN çalıştırılmaz/gerekmez.
create schema if not exists auth;

create or replace function auth.uid() returns uuid
language sql
stable
as $$
  select null::uuid
$$;
