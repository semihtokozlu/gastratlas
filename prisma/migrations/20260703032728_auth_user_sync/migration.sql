-- ============================================================
-- auth.users -> public.User senkronizasyonu
--
-- Şu ana kadar Supabase Auth üzerinden kayıt olan bir kullanıcı için
-- public."User" tablosunda karşılık gelen satır OLUŞTURULMUYORDU — bu,
-- src/lib/auth/guards.ts:getSessionUser()'ın db.user.findUnique ile
-- bulamayacağı, dolayısıyla requireRole()'un her zaman UNAUTHENTICATED
-- fırlatacağı gerçek bir eksikti. Bu trigger, Supabase'in resmi önerdiği
-- "auth.users insert -> public profiles tablosu" desenini uygular.
-- ============================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public."User" (id, email, "updatedAt")
  values (new.id, new.email, now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
