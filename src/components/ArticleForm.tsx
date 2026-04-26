'use client'

type ArticleFormType = {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  image_url: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
}

type Props = {
  form: ArticleFormType
  setForm: (form: ArticleFormType) => void
  onSubmit: (e: React.FormEvent) => void
  submitLabel: string
}

export default function ArticleForm({ form, setForm, onSubmit, submitLabel }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      {/* Content */}
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full border p-2 rounded"
        rows={5}
        required
      />

      {/* Excerpt */}
      <input
        type="text"
        placeholder="Excerpt"
        value={form.excerpt}
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        className="w-full border p-2 rounded"
      />

      {/* Category */}
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="general">General</option>
        <option value="company">Company</option>
        <option value="products">Products</option>
        <option value="sustainability">Sustainability</option>
        <option value="community">Community</option>
      </select>

      {/* Tags */}
      <input
        type="text"
        placeholder="tags (comma separated)"
        value={form.tags.join(', ')}
        onChange={(e) =>
          setForm({
            ...form,
            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
          })
        }
        className="w-full border p-2 rounded"
      />

      {/* Image URL */}
      <input
        type="text"
        placeholder="Image URL"
        value={form.image_url}
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        className="w-full border p-2 rounded"
      />

      {/* Status */}
      <select
        value={form.status}
        onChange={(e) =>
          setForm({
            ...form,
            status: e.target.value as 'draft' | 'published' | 'archived'
          })
        }
        className="w-full border p-2 rounded"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>

      {/* Submit */}
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        {submitLabel}
      </button>
    </form>
  )
}