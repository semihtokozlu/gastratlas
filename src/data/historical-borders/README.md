# Tarihi imparatorluk sınırları

Kaynak: [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
(GitHub, GPL-3.0 lisanslı). Kullanıcının açık onayıyla dahil edildi —
depo tek bir GPLv3 lisansı altında, veri için ayrı bir lisans belirtilmiyor.

Buradaki üç dosya, orijinal depodaki ilgili yıl anlık görüntülerinden
(`world_1400.geojson`, `world_1492.geojson`, `world_1600.geojson`)
yalnızca Osmanlı/Bizans/Safevi varlıkları çıkarılarak küçültülmüştür
(866 varlıktan 1-3'e). Geometri aynen korunmuştur, yalnızca `NAME`
özelliği `name` olarak sadeleştirilmiştir.

| Dosya | İçerik | Kullanım aralığı (harita kaydırıcısında) |
|---|---|---|
| `1400.json` | Bizans İmparatorluğu + Osmanlı İmparatorluğu | < 1453 |
| `1492.json` | Osmanlı İmparatorluğu (yalnız) | 1453–1500 |
| `1600.json` | Osmanlı İmparatorluğu + Safevi İmparatorluğu | ≥ 1501 |

Bu, gerçek tarihi sınırların kabaca yaklaşık değerleridir (üç ayrı
anlık görüntü, sürekli bir zaman serisi değil) — hassas kartografik
doğruluk iddiası taşımaz.
