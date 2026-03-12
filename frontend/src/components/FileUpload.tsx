import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle2, Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  accept?: string
  maxSizeMB?: number
  label?: string
}

export function FileUpload({ 
  onUploadComplete, 
  accept = "*/*", 
  maxSizeMB = 50,
  label = "Upload Media File"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await uploadFile(file)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(10) // Initial progress
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      setUploadProgress(30) // Pre-upload

      const { error } = await supabase.storage
        .from('qr_media')
        .upload(filePath, file, {
           cacheControl: '3600',
           upsert: false
        })

      if (error) {
        throw error
      }

      setUploadProgress(80) // Upload complete, getting URL

      const { data: { publicUrl } } = supabase.storage
        .from('qr_media')
        .getPublicUrl(filePath)

      setUploadProgress(100) // Finished
      setUploadedUrl(publicUrl)
      onUploadComplete(publicUrl)
      toast.success('File uploaded successfully!')

    } catch (error: any) {
      console.error('Upload Error:', error)
      toast.error(error.message || 'Failed to upload file.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedUrl(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (uploadedUrl) {
    return (
      <div className="relative glass-card border-none rounded-2xl p-6 group transition-all">
        <button 
          onClick={removeFile}
          className="absolute right-4 top-4 p-2 bg-background/50 hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-colors opacity-0 group-hover:opacity-100"
        >
           <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <div>
             <h3 className="font-bold text-lg">File Ready</h3>
             <p className="text-sm text-muted-foreground truncate max-w-[250px] mx-auto mt-1">
                {uploadedUrl}
             </p>
          </div>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mt-2">
            Target URL Automatically Set
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <input 
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
      />
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative glass-card border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[250px]",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/50 hover:border-primary/50 hover:bg-background/40",
          isUploading && "pointer-events-none"
        )}
      >
        {isUploading ? (
           <div className="space-y-6 w-full max-w-[200px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                 <h3 className="font-bold text-lg animate-pulse">Uploading Media...</h3>
                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                       className="h-full bg-primary transition-all duration-300"
                       style={{ width: `${uploadProgress}%` }}
                    />
                 </div>
              </div>
           </div>
        ) : (
           <div className="space-y-4 pointer-events-none">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                 <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <div>
                 <h3 className="font-bold text-lg mb-1">{label}</h3>
                 <p className="text-sm text-muted-foreground">
                    Drag and drop your file here, or click to browse
                 </p>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
                 Max Size: {maxSizeMB}MB
              </p>
           </div>
        )}
      </div>
    </div>
  )
}
