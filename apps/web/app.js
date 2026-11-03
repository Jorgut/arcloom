const resources = [
  {
    id: "liquid-glass",
    name: "Liquid Glass",
    type: "component",
    typeLabel: "React 组件",
    description: "为生产环境设计的半透明界面表面与控件，提供可读性、键盘焦点和降级处理。",
    creator: "Jorgut",
    stack: ["React", "CSS", "TypeScript"],
    license: "MIT",
    price: "免费 · 开源",
    source: "https://github.com/Jorgut/arcloom",
    sourceLabel: "GitHub 源码",
    preview: "glass",
    search: "liquid glass react accessible component translucency"
  },
  {
    id: "liquid-glass-button",
    name: "Liquid Glass Button",
    type: "component",
    typeLabel: "React 组件",
    description: "轻量的玻璃质感按钮，支持键盘焦点、触控交互和减少动态效果偏好。",
    creator: "Jorgut",
    stack: ["React", "CSS", "Accessibility"],
    license: "MIT",
    price: "免费 · 开源",
    source: "https://github.com/Jorgut/arcloom",
    sourceLabel: "GitHub 源码",
    preview: "button-preview",
    search: "liquid glass button react css accessibility"
  },
  {
    id: "liquid-glass-skill",
    name: "Liquid Glass Design Skill",
    type: "skill",
    typeLabel: "AI 工作流",
    description: "帮助 Codex、Claude Code 等编程助手判断、实现并审查玻璃质感界面的工作流。",
    creator: "Jorgut",
    stack: ["Codex", "Claude Code", "Agent Skill"],
    license: "MIT",
    price: "免费 · 开源",
    source: "https://github.com/Jorgut/arcloom/tree/main/skills/liquid-glass-design",
    sourceLabel: "GitHub Skill 文件",
    preview: "skill-preview",
    search: "liquid glass design skill codex claude ai workflow"
  }
];

const grid = document.querySelector("#resource-grid");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");
const resourceDialog = document.querySelector("#resource-dialog");
const resourceDetail = document.querySelector("#resource-detail");
const submitDialog = document.querySelector("#submit-dialog");
const submitForm = document.querySelector("#submit-form");
const toast = document.querySelector("#toast");

let activeFilter = "all";
let returnFocus = null;
let toastTimer;
const favoriteKey = "arcloom:favorites:v1";

function readLocalArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function isFavorite(id) {
  return readLocalArray(favoriteKey).includes(id);
}

function safeText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function previewMarkup(resource, detail = false) {
  const classes = `${detail ? "detail-visual" : "resource-preview"} ${resource.preview}`;
  if (resource.preview === "glass") {
    return `<div class="${classes}" aria-hidden="true"><div class="preview-window"><div class="preview-browser"><i></i><i></i><i></i><span>liquid glass / react</span></div><div class="preview-scene"><div class="preview-glass-panel"><b>Surface, with restraint.</b><small>Readable by design.</small><i>Explore component ↗</i></div></div></div></div>`;
  }
  if (resource.preview === "button-preview") {
    return `<div class="${classes}" aria-hidden="true"><div class="button-preview-scene"><span class="preview-caption">A small interaction detail</span><span class="mock-button">Continue <span>↗</span></span></div></div>`;
  }
  return `<div class="${classes}" aria-hidden="true"><div class="mock-skill"><span>AGENT SKILL</span><b>Design with<br>Liquid Glass</b><small>Decide · Implement · Review</small><i></i></div></div>`;
}

function cardMarkup(resource) {
  const favorite = isFavorite(resource.id);
  return `<article class="resource-card" data-id="${safeText(resource.id)}">
    <button class="favorite-button" data-favorite="${safeText(resource.id)}" aria-label="${favorite ? "取消收藏" : "收藏"}${safeText(resource.name)}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
    <button class="card-open" data-open-resource="${safeText(resource.id)}" aria-label="查看资源：${safeText(resource.name)}">
      ${previewMarkup(resource)}
      <div class="card-tags"><span>${safeText(resource.typeLabel)}</span><span>${safeText(resource.license)}</span></div>
      <h3 class="card-title">${safeText(resource.name)}</h3>
      <p class="card-desc">${safeText(resource.description)}</p>
    </button>
    <div class="card-bottom"><span><i class="creator-mark">${safeText(resource.creator.slice(0, 1))}</i>${safeText(resource.creator)}</span><span class="card-price">${safeText(resource.price)}</span></div>
  </article>`;
}

function visibleResources() {
  let list = [...resources];
  if (activeFilter === "favorites") list = list.filter((resource) => isFavorite(resource.id));
  else if (activeFilter !== "all") list = list.filter((resource) => resource.type === activeFilter);
  const query = searchInput.value.trim().toLocaleLowerCase("zh-CN");
  if (query) list = list.filter((resource) => `${resource.name} ${resource.description} ${resource.creator} ${resource.stack.join(" ")} ${resource.license} ${resource.search}`.toLocaleLowerCase("zh-CN").includes(query));
  if (sortSelect.value === "az") list.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  return list;
}

function renderResources() {
  const visible = visibleResources();
  grid.innerHTML = visible.map(cardMarkup).join("");
  resultCount.textContent = String(visible.length).padStart(2, "0");
  emptyState.hidden = visible.length > 0;
}

function openResource(id, trigger) {
  const resource = resources.find((item) => item.id === id);
  if (!resource) return;
  returnFocus = trigger;
  resourceDetail.innerHTML = `${previewMarkup(resource, true)}
    <div class="detail-heading"><div><div class="eyebrow eyebrow-muted">${safeText(resource.typeLabel)} / 资源详情</div><h2 id="detail-title">${safeText(resource.name)}</h2><p>${safeText(resource.description)}</p></div><span class="detail-price">${safeText(resource.price)}</span></div>
    <div class="detail-tags">${resource.stack.map((tag) => `<span>${safeText(tag)}</span>`).join("")}</div>
    <div class="detail-info"><div class="info-box"><span>创作者</span><b>${safeText(resource.creator)}</b></div><div class="info-box"><span>许可</span><b>${safeText(resource.license)}</b></div><div class="info-box"><span>来源</span><b>${safeText(resource.sourceLabel)}</b></div><div class="info-box"><span>获取方式</span><b>前往原始仓库查看</b></div></div>
    <div class="detail-actions"><a class="button button-dark" href="${safeText(resource.source)}" target="_blank" rel="noopener noreferrer">查看原始来源 <span aria-hidden="true">↗</span></a><button class="button button-light" data-copy-link="${safeText(resource.source)}">复制来源链接 <span aria-hidden="true">⌘</span></button></div>
    <p class="detail-note">Arcloom 仅提供发现入口。请在原始来源核对最新文件与完整许可；本资源目前没有在 Arcloom 单独售卖。</p>`;
  resourceDialog.showModal();
  resourceDialog.querySelector(".dialog-close").focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

function openSubmit(trigger) {
  returnFocus = trigger;
  document.querySelector("#submit-success").hidden = true;
  submitDialog.showModal();
  submitDialog.querySelector("#resource-name").focus();
}

function toggleFavorite(id) {
  const favorites = readLocalArray(favoriteKey);
  const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
  if (!writeLocalArray(favoriteKey, next)) {
    showToast("浏览器未能保存收藏，请检查本地存储设置。");
    return;
  }
  renderResources();
  showToast(next.includes(id) ? "已保存到本地收藏" : "已从本地收藏移除");
}

document.querySelectorAll("[data-open-submit]").forEach((button) => button.addEventListener("click", () => openSubmit(button)));
document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderResources();
}));
searchInput.addEventListener("input", renderResources);
sortSelect.addEventListener("change", renderResources);
grid.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) return toggleFavorite(favorite.dataset.favorite);
  const open = event.target.closest("[data-open-resource]");
  if (open) openResource(open.dataset.openResource, open);
});
resourceDetail.addEventListener("click", async (event) => {
  const copy = event.target.closest("[data-copy-link]");
  if (!copy) return;
  try {
    await navigator.clipboard.writeText(copy.dataset.copyLink);
    showToast("来源链接已复制");
  } catch {
    showToast("复制不可用，请点击“查看原始来源”打开链接。");
  }
});
submitForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = submitForm.querySelector('[type="submit"]');
  const formData = new FormData(submitForm);
  const success = document.querySelector("#submit-success");
  const payload = {
    name: String(formData.get("name") || "").trim(),
    url: String(formData.get("url") || "").trim(),
    note: String(formData.get("note") || "").trim(),
    rightsConfirmed: formData.get("rights") === "on",
    website: String(formData.get("website") || "").trim()
  };
  submitButton.disabled = true;
  submitButton.textContent = "正在提交…";
  try {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 503) {
        throw new Error("在线投稿还未开放。目录可以正常浏览，投稿暂时不会保存。");
      }
      if (response.status === 429) throw new Error("提交过于频繁，请稍后再试。");
      throw new Error(result.error || "提交失败，请稍后再试。");
    }
    success.hidden = false;
    submitForm.reset();
    showToast("投稿已收到，等待人工核验");
  } catch (error) {
    showToast(error instanceof TypeError ? "网络暂时不可用，请稍后重试。" : error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = '提交审核 <span aria-hidden="true">↗</span>';
  }
});
document.querySelector("[data-close-submit]").addEventListener("click", () => submitDialog.close());
for (const dialog of [resourceDialog, submitDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (returnFocus?.isConnected) returnFocus.focus();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

renderResources();

const initialSubmitButton = submitForm.querySelector('[type="submit"]');
initialSubmitButton.disabled = true;
fetch("/api/health", { headers: { Accept: "application/json" } })
  .then((response) => response.ok ? response.json() : null)
  .then((health) => {
    if (health?.submissionsEnabled) {
      initialSubmitButton.disabled = false;
      return;
    }
    const note = document.querySelector("#submission-note");
    if (note) note.textContent = "在线投稿尚未开放。当前可浏览目录；此表单不会保存或发送你的内容。";
  })
  .catch(() => {
    const note = document.querySelector("#submission-note");
    if (note) note.textContent = "当前为本地/静态预览，在线投稿接口未连接；表单内容不会保存。";
  });
