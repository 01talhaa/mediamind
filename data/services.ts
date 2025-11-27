import { Heart, Eye, ThumbsUp, MessageCircle, TrendingUp, Users, Award, Clock, Check, Zap, Video, Share2 } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface ServicePackage {
  name: string
  price: string
  duration: string
  revisions: string
  features: string[]
  popular?: boolean
}

export interface ProcessStep {
  step: string
  description: string
}

export interface ServiceStat {
  icon: LucideIcon
  label: string
  value: string
}

export interface Service {
  id: string
  icon: LucideIcon
  title: string
  tagline: string
  description: string
  longDescription?: string
  features: string[]
  process?: ProcessStep[]
  packages?: ServicePackage[]
  stats?: ServiceStat[]
  pricing?: string
  color: string
  image: string
}

export const servicesData: Record<string, Service> = {
  "instagram-growth": {
    id: "instagram-growth",
    icon: Heart,
    title: "Instagram Growth",
    tagline: "Real Followers, Real Engagement",
    description:
      "Boost your Instagram presence with authentic followers, likes, and comments. Grow your brand with targeted engagement that converts.",
    longDescription:
      "Our Instagram growth services help you build a genuine following with real, active users. We focus on quality engagement that aligns with your brand and target audience, ensuring long-term growth and visibility.",
    features: [
      "Real & Active Followers",
      "Targeted Audience Growth",
      "Organic Likes & Comments",
      "Story Views & Interactions",
      "Profile Optimization Tips",
      "24/7 Delivery & Support",
    ],
    process: [
      { step: "Order", description: "Select your package and provide Instagram handle" },
      { step: "Target", description: "We identify your ideal audience demographics" },
      { step: "Deliver", description: "Gradual, natural growth begins within hours" },
      { step: "Engage", description: "Monitor real engagement from active users" },
      { step: "Grow", description: "Watch your Instagram presence expand organically" },
    ],
    packages: [
      {
        name: "Starter Pack",
        price: "৳ 1,500",
        duration: "3-5 Days",
        revisions: "N/A",
        features: ["1,000 Instagram Followers", "100% Real Accounts", "Gradual Delivery", "No Password Required", "Instant Start"],
      },
      {
        name: "Growth Pack",
        price: "৳ 3,500",
        duration: "7-10 Days",
        revisions: "N/A",
        features: ["5,000 Instagram Followers", "High-Quality Accounts", "Natural Growth Pattern", "Includes 500 Likes", "Priority Support"],
        popular: true,
      },
      {
        name: "Premium Pack",
        price: "৳ 10,000",
        duration: "14-20 Days",
        revisions: "N/A",
        features: [
          "25,000 Instagram Followers",
          "Premium Active Users",
          "Includes 2,000 Likes",
          "Story Views Included",
          "Dedicated Account Manager",
        ],
      },
    ],
    stats: [
      { icon: Users, label: "Followers Delivered", value: "1M+" },
      { icon: Award, label: "Client Satisfaction", value: "98%" },
      { icon: Clock, label: "Average Delivery", value: "24hrs" },
    ],
    pricing: "Starting ৳ 1,500",
    color: "from-pink-500/20 to-rose-500/20",
    image: "/creative-direction-team-brainstorming.jpg",
  },
  "facebook-engagement": {
    id: "facebook-engagement",
    icon: ThumbsUp,
    title: "Facebook Likes & Fans",
    tagline: "Build Your Facebook Authority",
    description:
      "Increase your Facebook page likes, post engagement, and reach. Establish credibility with a strong social presence.",
    longDescription:
      "Facebook remains a powerful platform for businesses. Our services help you build page authority with genuine likes, post engagement, and video views that boost your algorithmic reach.",
    features: [
      "Page Likes from Real Users",
      "Post Likes & Reactions",
      "Comment & Share Boost",
      "Video Views & Watch Time",
      "Group Members Growth",
      "Instant Delivery Options",
    ],
    process: [
      { step: "Select", description: "Choose Facebook service (page likes, post likes, etc.)" },
      { step: "Link", description: "Provide Facebook page or post URL" },
      { step: "Process", description: "Engagement starts within minutes" },
      { step: "Track", description: "Monitor growth in real-time" },
      { step: "Scale", description: "Upgrade anytime for continued growth" },
    ],
    packages: [
      {
        name: "Basic Boost",
        price: "৳ 1,200",
        duration: "2-4 Days",
        revisions: "N/A",
        features: ["1,000 Page Likes", "Real Facebook Users", "Safe Delivery", "Lifetime Guarantee", "Quick Start"],
      },
      {
        name: "Business Growth",
        price: "৳ 4,000",
        duration: "5-7 Days",
        revisions: "N/A",
        features: ["5,000 Page Likes", "High Retention Rate", "Includes Post Likes", "Priority Processing", "Free Refill 30 Days"],
        popular: true,
      },
      {
        name: "Brand Authority",
        price: "৳ 12,000",
        duration: "10-15 Days",
        revisions: "N/A",
        features: [
          "30,000 Page Likes",
          "Premium Quality",
          "Video Views Included",
          "Group Member Boost",
          "Full Support Package",
        ],
      },
    ],
    stats: [
      { icon: ThumbsUp, label: "Likes Delivered", value: "5M+" },
      { icon: Check, label: "Success Rate", value: "99.5%" },
      { icon: Zap, label: "Start Time", value: "< 1hr" },
    ],
    pricing: "Starting ৳ 1,200",
    color: "from-blue-500/20 to-cyan-500/20",
    image: "/abstract-motion-graphics.png",
  },
  "youtube-views": {
    id: "youtube-views",
    icon: Eye,
    title: "YouTube Views & Subscribers",
    tagline: "Boost Your YouTube Authority",
    description:
      "Get more YouTube views, subscribers, and watch time. Increase your video ranking and monetization potential.",
    longDescription:
      "YouTube success requires consistent views and engagement. We provide high-retention views, real subscribers, and likes that help your videos rank higher and attract organic traffic.",
    features: [
      "High Retention Views",
      "Real YouTube Subscribers",
      "Video Likes & Comments",
      "Increased Watch Time",
      "Improved Search Ranking",
      "Monetization Support",
    ],
    process: [
      { step: "Video Link", description: "Share your YouTube video or channel URL" },
      { step: "Select Service", description: "Choose views, subscribers, or combo" },
      { step: "Delivery Start", description: "Views start within 1-2 hours" },
      { step: "Ranking Boost", description: "Watch your video climb search results" },
      { step: "Organic Growth", description: "Attract more real viewers naturally" },
    ],
    packages: [
      {
        name: "View Boost",
        price: "৳ 800",
        duration: "1-3 Days",
        revisions: "N/A",
        features: ["1,000 YouTube Views", "High Retention", "Real Users", "Safe for Monetization", "Instant Start"],
      },
      {
        name: "Channel Growth",
        price: "৳ 5,000",
        duration: "5-7 Days",
        revisions: "N/A",
        features: ["10,000 Views", "500 Subscribers", "100 Likes Included", "Watch Time Boost", "Algorithm Friendly"],
        popular: true,
      },
      {
        name: "Viral Package",
        price: "৳ 15,000",
        duration: "10-14 Days",
        revisions: "N/A",
        features: [
          "50,000 Views",
          "2,000 Subscribers",
          "500 Likes + Comments",
          "Premium Retention",
          "Monetization Ready",
        ],
      },
    ],
    stats: [
      { icon: Eye, label: "Views Delivered", value: "100M+" },
      { icon: Video, label: "Videos Boosted", value: "50k+" },
      { icon: Award, label: "Retention Rate", value: "85%" },
    ],
    pricing: "Starting ৳ 800",
    color: "from-red-500/20 to-orange-500/20",
    image: "/3d-animation-production.jpg",
  },
  "tiktok-viral": {
    id: "tiktok-viral",
    icon: TrendingUp,
    title: "TikTok Growth & Virality",
    tagline: "Go Viral on TikTok",
    description:
      "Amplify your TikTok presence with followers, views, and likes. Get on the For You page and reach millions.",
    longDescription:
      "TikTok's algorithm favors engagement. Our services help you get the initial boost needed to trigger viral growth, with real engagement from active TikTok users worldwide.",
    features: [
      "TikTok Followers",
      "Video Views & Shares",
      "Likes from Real Users",
      "Comments & Engagement",
      "For You Page Boost",
      "Viral Growth Strategy",
    ],
    process: [
      { step: "Username", description: "Provide your TikTok username" },
      { step: "Select Package", description: "Choose your growth service" },
      { step: "Fast Delivery", description: "Engagement starts immediately" },
      { step: "Algorithm Trigger", description: "Boost helps trigger For You page" },
      { step: "Go Viral", description: "Watch your content reach millions" },
    ],
    packages: [
      {
        name: "Starter Viral",
        price: "৳ 1,000",
        duration: "1-2 Days",
        revisions: "N/A",
        features: ["1,000 TikTok Followers", "5,000 Video Views", "Real Engagement", "Fast Delivery", "Safe & Secure"],
      },
      {
        name: "Trending Pack",
        price: "৳ 4,500",
        duration: "3-5 Days",
        revisions: "N/A",
        features: ["5,000 Followers", "25,000 Views", "1,000 Likes", "For You Page Boost", "Priority Delivery"],
        popular: true,
      },
      {
        name: "Mega Viral",
        price: "৳ 13,000",
        duration: "7-10 Days",
        revisions: "N/A",
        features: [
          "20,000 Followers",
          "100,000 Views",
          "5,000 Likes",
          "Viral Strategy Guide",
          "Dedicated Support",
        ],
      },
    ],
    stats: [
      { icon: TrendingUp, label: "Views Generated", value: "500M+" },
      { icon: Users, label: "Accounts Grown", value: "25k+" },
      { icon: Zap, label: "Viral Success Rate", value: "92%" },
    ],
    pricing: "Starting ৳ 1,000",
    color: "from-purple-500/20 to-pink-500/20",
    image: "/brand-identity-process.png",
  },
  "social-media-management": {
    id: "social-media-management",
    icon: Share2,
    title: "Social Media Management",
    tagline: "Complete Social Media Solutions",
    description:
      "Full-service social media management including content creation, posting schedule, engagement, and growth strategies across all platforms.",
    longDescription:
      "Let us handle your entire social media presence. From content creation to engagement and growth, we manage everything so you can focus on your business.",
    features: [
      "Multi-Platform Management",
      "Content Creation & Design",
      "Daily Posting Schedule",
      "Community Engagement",
      "Growth Strategy & Analytics",
      "Monthly Performance Reports",
    ],
    process: [
      { step: "Consultation", description: "Discuss your brand goals and target audience" },
      { step: "Strategy", description: "Create customized content and growth plan" },
      { step: "Content Creation", description: "Design posts, videos, and stories" },
      { step: "Management", description: "Daily posting and community engagement" },
      { step: "Reporting", description: "Monthly analytics and strategy optimization" },
    ],
    packages: [
      {
        name: "Starter Management",
        price: "৳ 8,000/mo",
        duration: "Monthly",
        revisions: "2 per month",
        features: ["2 Platforms (Instagram + Facebook)", "15 Posts/Month", "Basic Graphics", "Community Management", "Monthly Report"],
      },
      {
        name: "Business Growth",
        price: "৳ 18,000/mo",
        duration: "Monthly",
        revisions: "4 per month",
        features: ["4 Platforms", "30 Posts/Month", "Professional Design", "Daily Engagement", "Advanced Analytics", "Growth Services"],
        popular: true,
      },
      {
        name: "Enterprise Solution",
        price: "৳ 35,000/mo",
        duration: "Monthly",
        revisions: "Unlimited",
        features: [
          "All Major Platforms",
          "60+ Posts/Month",
          "Video Content",
          "24/7 Management",
          "Dedicated Manager",
          "Full Growth Package",
        ],
      },
    ],
    stats: [
      { icon: Users, label: "Clients Served", value: "500+" },
      { icon: TrendingUp, label: "Avg. Growth Rate", value: "300%" },
      { icon: MessageCircle, label: "Engagement Boost", value: "450%" },
    ],
    pricing: "Starting ৳ 8,000/mo",
    color: "from-green-500/20 to-emerald-500/20",
    image: "/3d-animation-production.jpg",
  },
}

// Helper function to get all services as an array
export const getAllServices = (): Service[] => {
  return Object.values(servicesData)
}

// Helper function to get a service by ID
export const getServiceById = (id: string): Service | undefined => {
  return servicesData[id]
}

// Helper function to get all service IDs
export const getAllServiceIds = (): string[] => {
  return Object.keys(servicesData)
}
