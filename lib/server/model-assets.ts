export const MAX_MODEL_BYTES = 50 * 1024 * 1024;
export function validateModelUpload(file: { name: string; type: string; size: number }) {
  const extension = file.name.toLowerCase().split(".").pop();
  const accepted = extension === "glb" || extension === "gltf";
  const mimeAccepted = !file.type || file.type === "model/gltf-binary" || file.type === "model/gltf+json" || file.type === "application/octet-stream";
  return { valid: accepted && mimeAccepted && file.size > 0 && file.size <= MAX_MODEL_BYTES, format: extension === "gltf" ? "gltf" : "glb", reason: !accepted ? "Only GLB and glTF models are accepted." : !mimeAccepted ? "Unsupported model content type." : file.size > MAX_MODEL_BYTES ? "Model exceeds the 50 MB upload limit." : file.size <= 0 ? "The selected model is empty." : null } as const;
}
