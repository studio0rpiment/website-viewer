import { supabase } from './supabase'

/** Public bucket for student images. Created by supabase/schema.sql. */
export const BUCKET = 'uploads'

/**
 * Upload an image and return its public URL. Path is namespaced by showcase so
 * the bucket stays browsable; a timestamp avoids stale CDN copies on re-upload.
 */
export async function uploadImage(file: File, folder: string, name: string): Promise<string> {
  if (!supabase) throw new Error('No database configured')
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `${folder}/${name}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: '31536000',
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
