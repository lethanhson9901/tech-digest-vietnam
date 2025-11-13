import requests, time

BASE = "https://newsnow.busiyi.world"  # tự host thì đổi thành domain của bạn
resp = requests.get(f"{BASE}/api/s", params={"id": "zhihu"}, timeout=15)
resp.raise_for_status()
data = resp.json()  # dữ liệu hot/trending của nguồn "zhihu"

# ví dụ chuyển về schema thống nhất tối giản cho backend khác
items = []
for it in data.get("items", data):  # phòng trường hợp API trả list hoặc {items:[]}
    items.append({
        "source": "zhihu",
        "title": it.get("title") or it.get("text"),
        "url": it.get("url") or it.get("link"),
        "score": it.get("hot") or it.get("heat") or it.get("rank"),
        "ts": it.get("timestamp") or it.get("time") or int(time.time()),
        "raw": it,  # giữ nguyên để dễ debug/mở rộng
    })

# gửi sang backend khác
import json, requests as rq
rq.post("https://your-backend/internal/ingest/newsnow", json=items, timeout=15)
