"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Play, Tv, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Gradients */}
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]"
        />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center">
          <img src="/logo.png" alt="Huddle Logo" className="w-20 h-20 object-contain" />
        </div>

        <div className="flex items-center gap-6">
          <ModeToggle />
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">Features</Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">About</Link>
          {/* Login placeholder */}
          <Button variant="ghost" size="sm" className="hidden md:flex">Log In</Button>
          <Button variant="premium" size="sm" className="hidden md:flex">Get Started</Button>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 text-xs font-medium mb-4">
            <Zap className="w-3 h-3 mr-1" />
            <span>Next Gen Streaming & Collaboration</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Stream.</span> Engage.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The ultimate platform for seamless video conferencing and high-definition social streaming.
            Whether it's business or pleasure, experience it in 1080p clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/dashboard?mode=work">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 w-full sm:w-[280px] h-[200px] flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 transition-colors cursor-pointer shadow-lg">
                  <div className="p-4 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <Briefcase className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl">Work Mode</h3>
                    <p className="text-sm text-muted-foreground">Professional meetings & screen sharing</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/dashboard?mode=play">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 w-full sm:w-[280px] h-[200px] flex flex-col items-center justify-center gap-4 hover:border-purple-500/50 transition-colors cursor-pointer shadow-lg">
                  <div className="p-4 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Play className="w-8 h-8 text-purple-500 ml-1" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl">Play Mode</h3>
                    <p className="text-sm text-muted-foreground">Synchronized movies & music</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            { icon: Users, title: "Real-time Interaction", desc: "Chat, voice, and reaction support with minimal latency." },
            { icon: Tv, title: "HD Streaming", desc: "Experience content in crystal clear 1080p without buffering." },
            { icon: Zap, title: "AI Powered", desc: "Smart subtitles and noise cancellation for perfect audio." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors text-left"
            >
              <feature.icon className="w-10 h-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
