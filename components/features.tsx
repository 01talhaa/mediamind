"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "Why Brands Trust MediaMind for Social Growth",
  subtitle: "Real results, authentic engagement, and proven strategies that scale",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20 bg-gradient-to-b from-[#08090A] via-[#0F1113] to-[#08090A]">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-[#F4F7F5] sm:text-5xl animate-fade-in-up">
        {content.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Adaptability Card - Hidden on mobile */}
        <Card className="hidden md:block liquid-glass border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up delay-200">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-[#008CE2]">AUTHENTIC GROWTH</p>
            <CardTitle className="mt-1 text-xl text-[#F4F7F5]">Real followers, real engagement, real results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#008CE2]/30 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-5xl mb-2">📱</div>
                  <p className="text-sm text-[#F4F7F5]/80 font-semibold">Instagram Growth</p>
                  <p className="text-xs text-[#F4F7F5]/60 mt-1">Real Followers</p>
                </div>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#008CE2]/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-5xl mb-2">▶️</div>
                  <p className="text-sm text-[#F4F7F5]/80 font-semibold">YouTube Views</p>
                  <p className="text-xs text-[#F4F7F5]/60 mt-1">High Retention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Love Card - Always visible */}
        <Card className="liquid-glass border border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up delay-300">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-[#008CE2]">CLIENT SUCCESS</p>
            <CardTitle className="mt-1 text-xl text-[#F4F7F5]">
              MediaMind helped us grow from 5K to 100K followers in 3 months. The engagement is real and our sales skyrocketed!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-end gap-4">
              <div className="text-5xl font-bold text-[#008CE2]">4.9</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#008CE2] text-[#008CE2]" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-[#008CE2]/30 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <div className="text-center p-3">
                  <div className="text-4xl mb-2">🎵</div>
                  <p className="text-sm text-[#F4F7F5]/80 font-semibold">TikTok Viral</p>
                  <p className="text-xs text-[#F4F7F5]/60 mt-1">10M+ Views</p>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl border border-[#008CE2]/30 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                <div className="text-center p-3">
                  <div className="text-4xl mb-2">👍</div>
                  <p className="text-sm text-[#F4F7F5]/80 font-semibold">Facebook Likes</p>
                  <p className="text-xs text-[#F4F7F5]/60 mt-1">Real Engagement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
