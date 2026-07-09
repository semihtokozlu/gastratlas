# Tarihi imparatorluk sınırları

Kaynak: [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
(GitHub, GPL-3.0 lisanslı). Kullanıcının açık onayıyla dahil edildi —
depo tek bir GPLv3 lisansı altında, veri için ayrı bir lisans belirtilmiyor.

Buradaki üç dosya, orijinal depodaki ilgili yıl anlık görüntülerinden
(`world_1400.geojson`, `world_1492.geojson`, `world_1600.geojson`)
yalnızca Osmanlı/Bizans/Safevi varlıkları çıkarılarak küçültülmüştür
(866 varlıktan 1-3'e). `NAME` özelliği `name` olarak sadeleştirilmiştir.

Geometri ayrıca Douglas-Peucker algoritmasıyla basitleştirildi (epsilon
0.08° — köşe say��sı ~%60 azaltıldı) — ham veri harita zoom seviyemizde
gereğinden fazla köşeli/keskin görünüyordu; bu yalnızca görsel bir
yumuşatmadır, sınırların temsil ettiği tarihi kapsamı değiştirmez.

| Dosya | İçerik (kaynaktaki orijinal ad → bizim `name`) |
|---|---|
| `700.json` | Eastern Roman Empire → Byzantine Empire |
| `900.json` | Byzantine Empire; Abbasid Caliphate; Emirate of Córdoba → Umayyad Caliphate of Córdoba |
| `1100.json` | Byzantine Empire; Seljuk Empire → Sultanate of Rum |
| `1300.json` | Byzantine Empire; Ilkhanate; Mamluke Sultanate → Mamluk Sultanate; Seljuk Caliphate → Sultanate of Rum |
| `1400.json` | Byzantine Empire; Ottoman Empire |
| `1492.json` | Ottoman Empire (yalnız) |
| `1600.json` | Ottoman Empire; Safavid Empire |

Bu, gerçek tarihi sınırların kabaca yaklaşık değerleridir (yedi ayrı
anlık görüntü, sürekli bir zaman serisi değil) — hassas kartografik
doğruluk iddiası taşımaz. Hangi yılda hangi dosyanın gösterileceği ve
o dosyadaki hangi varlığın seçili yıl için hâlâ geçerli olduğu, kod
tarafında (`src/lib/history/empires.ts`) medeniyetlerin gerçek
başlangıç/bitiş yıllarına göre ayrıca filtrelenir — yani örneğin
`900.json` kullanılırken seçili yıl 1035 ise Endülüs Emevi Halifeliği
(1031'de sona erdi) otomatik olarak gizlenir, dosya değişmeden.

## `land.json` — kıta silueti

Harita artık modern bir "Google Maps" görünümü (yol/şehir/etiket) yerine
yalnızca dönem sınırlarını gösteren bir atlas plakası gibi tasarlandı.
Bunun için arka planda bir döşeme (tile) servisi yerine, tek seferlik
indirilip basitleştirilmiş statik bir kıta silueti kullanılıyor:

Kaynak: [Natural Earth](https://www.naturalearthdata.com/) `ne_110m_land`
(kamu malı / public domain — telif kısıtlaması yok). Douglas-Peucker ile
basitleştirildi (epsilon 0.35° — yalnızca sabit zoom seviyesinde soft bir
arka plan siluetidir, kartografik hassasiyet gerekmez; köşe sayısı
%56 azaltıldı, 5143 → 2282).
