'use client'

export function ReviewCarousel({ reviews }: { reviews: any[] }) {
  if (!reviews?.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.slice(0, 3).map((review) => (
        <div key={review.id} className="bg-stone-50 p-8 text-center border border-stone-100">
          <div className="flex justify-center text-yellow-600 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < review.rating ? 'opacity-100' : 'opacity-30'}>★</span>
            ))}
          </div>
          <p className="text-gray-600 italic mb-6 font-serif leading-relaxed text-lg">"{review.comment}"</p>
          <p className="text-xs uppercase tracking-widest font-medium text-gray-900">- {review.profiles?.full_name || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  )
}
