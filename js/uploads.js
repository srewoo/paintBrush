// Uploaded pictures in chrome.storage.local: an index list plus one key per picture (its line-art PNG)
// and one per picture's fills, so a tap only rewrites a few bytes.
const INDEX = 'uploads';
export const MAX_PICTURES = 20;

const store = chrome.storage.local;

export async function listPictures() {
  return (await store.get(INDEX))[INDEX] ?? [];
}

export async function addPicture({ name, w, h, png }) {
  const list = await listPictures();
  if (list.length >= MAX_PICTURES) throw new Error(`You can keep up to ${MAX_PICTURES} pictures. Delete one to add another.`);
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const meta = { id, name: name.slice(0, 60), w, h };
  await store.set({ [`up:${id}`]: { png }, [`upf:${id}`]: [], [INDEX]: [meta, ...list] });
  return meta;
}

export async function loadPicture(meta) {
  const got = await store.get([`up:${meta.id}`, `upf:${meta.id}`]);
  if (!got[`up:${meta.id}`]) throw new Error('This picture could not be found. It may have been deleted.');
  return { ...meta, png: got[`up:${meta.id}`].png, fills: got[`upf:${meta.id}`] ?? [] };
}

export const saveFills = (id, fills) => store.set({ [`upf:${id}`]: fills });

export async function deletePicture(id) {
  const list = (await listPictures()).filter((p) => p.id !== id);
  await store.remove([`up:${id}`, `upf:${id}`]);
  await store.set({ [INDEX]: list });
}
