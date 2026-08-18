export async function uploadProfileImage(_userId: string, file: File, type: 'avatar' | 'banner'): Promise<string | null> {
  // Since remote Supabase storage buckets are not configured/available, 
  // we will downscale the image and store it as an optimized base64 string directly in the database.
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = type === 'avatar' ? 256 : 1024
        const MAX_HEIGHT = type === 'avatar' ? 256 : 512
        
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        // Compress heavily to avoid bloating the JSON blob
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}
