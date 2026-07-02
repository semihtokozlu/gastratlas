-- ============================================================
-- Row Level Security — ikinci savunma katmanı (bkz. planlama §9)
--
-- ÖNEMLİ: Uygulama sunucu tarafında (src/lib/db.ts) Prisma ile
-- DATABASE_URL üzerinden "postgres" rolüne bağlanır; bu rol RLS'i
-- bypass eder. Bu politikaların gerçek amacı, Supabase'in anon/
-- authenticated anahtarlarıyla PostgREST/Realtime/Storage üzerinden
-- YAPILACAK DOĞRUDAN erişimi (uygulama katmanı atlanırsa bile)
-- kısıtlamaktır. Birinci katman: src/lib/auth/guards.ts requireRole().
-- ============================================================

-- ------------------------------------------------------------
-- 1) Rol yardımcı fonksiyonları
-- ------------------------------------------------------------

create or replace function public.current_role_level()
returns int
language sql
security definer
stable
set search_path = public
as $$
  select case
    when auth.uid() is null then 0
    else coalesce(
      (select case "role"
        when 'ADMIN' then 4
        when 'HISTORIAN' then 3
        when 'EDITOR' then 2
        when 'USER' then 1
        else 0
      end
      from "User" where id = auth.uid()),
      1 -- authenticated ama User satırı henüz yoksa (signup webhook gecikmesi): en az USER say
    )
  end;
$$;

create or replace function public.has_min_role(min_role text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.current_role_level() >= case min_role
    when 'ADMIN' then 4
    when 'HISTORIAN' then 3
    when 'EDITOR' then 2
    when 'USER' then 1
    else 0
  end;
$$;

revoke all on function public.current_role_level() from public;
revoke all on function public.has_min_role(text) from public;
grant execute on function public.current_role_level() to anon, authenticated;
grant execute on function public.has_min_role(text) to anon, authenticated;

-- Kullanıcı kendi rolünü değiştiremesin (ADMIN hariç) — RLS WITH CHECK'in
-- OLD satıra erişemediği durumlar için trigger ile ek güvence.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new."role" is distinct from old."role" and not public.has_min_role('ADMIN') then
    raise exception 'Yalnızca ADMIN rol değiştirebilir';
  end if;
  return new;
end;
$$;

create trigger trg_prevent_role_self_escalation
  before update on "User"
  for each row execute function public.prevent_role_self_escalation();

-- ------------------------------------------------------------
-- 2) RLS'i tüm tablolarda etkinleştir
-- ------------------------------------------------------------

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'User','Author',
    'Country','CountryTranslation','Region','RegionTranslation','City','CityTranslation',
    'Civilization','CivilizationTranslation','Dynasty','DynastyTranslation','Era','EraTranslation',
    'TimelineEvent','TimelineEventTranslation',
    'Cuisine','CuisineTranslation','Category','CategoryTranslation','Tag','TagTranslation',
    'Ingredient','IngredientTranslation','IngredientAlternative',
    'HistoricalSource','Image','Gallery',
    'Recipe','RecipeTranslation','RecipeStep','RecipeStepTranslation','RecipeIngredient',
    'Nutrition','RecipeSource','RecipeTag',
    'Favorite','Collection','CollectionRecipe','Comment',
    'PromptHistory','AIJob','Notification','NewsletterSubscriber','AdminLog','AuditLog'
  ])
  loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- 3) Grup A — statik referans verisi: herkese açık okuma, EDITOR+ yazma, ADMIN silme
-- ------------------------------------------------------------

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'Country','CountryTranslation','Region','RegionTranslation','City','CityTranslation',
    'Civilization','CivilizationTranslation','Dynasty','DynastyTranslation','Era','EraTranslation',
    'TimelineEvent','TimelineEventTranslation',
    'Cuisine','CuisineTranslation','Category','CategoryTranslation','Tag','TagTranslation',
    'Ingredient','IngredientTranslation','IngredientAlternative',
    'HistoricalSource','Author','Image','Gallery'
  ])
  loop
    execute format('create policy "%1$s_public_read" on %1$I for select using (true)', t);
    execute format('create policy "%1$s_editor_write" on %1$I for insert with check (public.has_min_role(''EDITOR''))', t);
    execute format('create policy "%1$s_editor_update" on %1$I for update using (public.has_min_role(''EDITOR'')) with check (public.has_min_role(''EDITOR''))', t);
    execute format('create policy "%1$s_admin_delete" on %1$I for delete using (public.has_min_role(''ADMIN''))', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- 4) Grup B — Recipe ve tarife bağlı içerik
--    Herkese açık okuma yalnızca status = 'PUBLISHED'; EDITOR+ tüm statüleri görür.
--    EDITOR taslak yazabilir ama PUBLISHED'e çeken alan yalnızca HISTORIAN/ADMIN.
-- ------------------------------------------------------------

create policy "Recipe_public_read" on "Recipe"
  for select using (status = 'PUBLISHED' or public.has_min_role('EDITOR'));

create policy "Recipe_editor_insert" on "Recipe"
  for insert with check (
    public.has_min_role('EDITOR')
    and (status <> 'PUBLISHED' or public.has_min_role('HISTORIAN'))
  );

create policy "Recipe_editor_update" on "Recipe"
  for update using (public.has_min_role('EDITOR'))
  with check (
    public.has_min_role('EDITOR')
    and (status <> 'PUBLISHED' or public.has_min_role('HISTORIAN'))
  );

create policy "Recipe_admin_delete" on "Recipe"
  for delete using (public.has_min_role('ADMIN'));

-- recipeId üzerinden Recipe'ye bağlı çocuk tablolar (aynı görünürlük kuralı)
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'RecipeTranslation','RecipeStep','RecipeIngredient','Nutrition','RecipeSource','RecipeTag'
  ])
  loop
    execute format($f$
      create policy "%1$s_public_read" on %1$I for select using (
        exists (
          select 1 from "Recipe" r
          where r.id = %1$I."recipeId"
            and (r.status = 'PUBLISHED' or public.has_min_role('EDITOR'))
        )
      )$f$, t);
    execute format($f$
      create policy "%1$s_editor_write" on %1$I for insert with check (public.has_min_role('EDITOR'))
    $f$, t);
    execute format($f$
      create policy "%1$s_editor_update" on %1$I for update
        using (public.has_min_role('EDITOR')) with check (public.has_min_role('EDITOR'))
    $f$, t);
    execute format($f$
      create policy "%1$s_admin_delete" on %1$I for delete using (public.has_min_role('ADMIN'))
    $f$, t);
  end loop;
end $$;

-- RecipeStepTranslation: RecipeStep'e bağlı (bir seviye daha derin)
create policy "RecipeStepTranslation_public_read" on "RecipeStepTranslation"
  for select using (
    exists (
      select 1 from "RecipeStep" s
      join "Recipe" r on r.id = s."recipeId"
      where s.id = "RecipeStepTranslation"."stepId"
        and (r.status = 'PUBLISHED' or public.has_min_role('EDITOR'))
    )
  );

create policy "RecipeStepTranslation_editor_write" on "RecipeStepTranslation"
  for insert with check (public.has_min_role('EDITOR'));

create policy "RecipeStepTranslation_editor_update" on "RecipeStepTranslation"
  for update using (public.has_min_role('EDITOR')) with check (public.has_min_role('EDITOR'));

create policy "RecipeStepTranslation_admin_delete" on "RecipeStepTranslation"
  for delete using (public.has_min_role('ADMIN'));

-- ------------------------------------------------------------
-- 5) Grup C — kullanıcıya özel veri
-- ------------------------------------------------------------

-- User: kendi satırını görür/günceller; ADMIN herkesi görür/yönetir
create policy "User_self_read" on "User"
  for select using (id = auth.uid() or public.has_min_role('ADMIN'));

create policy "User_self_update" on "User"
  for update using (id = auth.uid() or public.has_min_role('ADMIN'))
  with check (id = auth.uid() or public.has_min_role('ADMIN'));

create policy "User_admin_delete" on "User"
  for delete using (public.has_min_role('ADMIN'));
-- INSERT: yalnızca auth webhook / service role (RLS bypass) — istemci politikası yok.

-- Favorite: yalnızca sahibi
create policy "Favorite_owner_all" on "Favorite"
  for all using ("userId" = auth.uid()) with check ("userId" = auth.uid());

-- Collection: sahibi tam yetkili; herkese açık koleksiyonlar herkese görünür; EDITOR+ hepsini görür
create policy "Collection_read" on "Collection"
  for select using ("userId" = auth.uid() or "isPublic" = true or public.has_min_role('EDITOR'));

create policy "Collection_owner_write" on "Collection"
  for insert with check ("userId" = auth.uid());

create policy "Collection_owner_update" on "Collection"
  for update using ("userId" = auth.uid()) with check ("userId" = auth.uid());

create policy "Collection_owner_delete" on "Collection"
  for delete using ("userId" = auth.uid());

-- CollectionRecipe: üst koleksiyon üzerinden erişim
create policy "CollectionRecipe_read" on "CollectionRecipe"
  for select using (
    exists (
      select 1 from "Collection" c
      where c.id = "CollectionRecipe"."collectionId"
        and (c."userId" = auth.uid() or c."isPublic" = true or public.has_min_role('EDITOR'))
    )
  );

create policy "CollectionRecipe_owner_write" on "CollectionRecipe"
  for insert with check (
    exists (select 1 from "Collection" c where c.id = "CollectionRecipe"."collectionId" and c."userId" = auth.uid())
  );

create policy "CollectionRecipe_owner_delete" on "CollectionRecipe"
  for delete using (
    exists (select 1 from "Collection" c where c.id = "CollectionRecipe"."collectionId" and c."userId" = auth.uid())
  );

-- Comment: onaylanmış yorumlar herkese açık; sahibi kendi yorumunu görür/yazar; EDITOR+ moderasyon yapar
create policy "Comment_read" on "Comment"
  for select using (status = 'APPROVED' or "userId" = auth.uid() or public.has_min_role('EDITOR'));

create policy "Comment_insert" on "Comment"
  for insert with check ("userId" = auth.uid());

create policy "Comment_owner_or_editor_update" on "Comment"
  for update using ("userId" = auth.uid() or public.has_min_role('EDITOR'))
  with check ("userId" = auth.uid() or public.has_min_role('EDITOR'));

create policy "Comment_owner_or_editor_delete" on "Comment"
  for delete using ("userId" = auth.uid() or public.has_min_role('EDITOR'));

-- Notification: yalnızca sahibi görür / okundu işaretler; ekleme backend (service role) işi
create policy "Notification_owner_read" on "Notification"
  for select using ("userId" = auth.uid());

create policy "Notification_owner_update" on "Notification"
  for update using ("userId" = auth.uid()) with check ("userId" = auth.uid());

-- ------------------------------------------------------------
-- 6) Grup D — içsel / editoryal tablolar (AI, loglar, bülten)
-- ------------------------------------------------------------

-- PromptHistory: yalnızca EDITOR+ okur; istemci yazamaz (yönetim backend'den)
create policy "PromptHistory_editor_read" on "PromptHistory"
  for select using (public.has_min_role('EDITOR'));

-- AIJob: sahibi kendi işini görür, EDITOR+ hepsini görür; USER kendi işini açabilir
create policy "AIJob_read" on "AIJob"
  for select using ("createdById" = auth.uid() or public.has_min_role('EDITOR'));

create policy "AIJob_owner_insert" on "AIJob"
  for insert with check ("createdById" = auth.uid());

-- AdminLog: yalnızca ADMIN okur; istemci yazamaz (backend/service role)
create policy "AdminLog_admin_read" on "AdminLog"
  for select using (public.has_min_role('ADMIN'));

-- AuditLog: HISTORIAN+ okur; istemci yazamaz (backend/service role)
create policy "AuditLog_historian_read" on "AuditLog"
  for select using (public.has_min_role('HISTORIAN'));

-- NewsletterSubscriber: hiçbir client policy yok — yalnızca service role
-- (RLS bypass) erişebilir. Server Action bu tabloyu service key ile yazar.
