import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Zap, Users, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative bg-gradient-to-b from-primary/90 to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Welcome to My Next.js App
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Build amazing things with Next.js & Modern UI Components
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Awesome Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Optimized for speed and efficiency with modern technologies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>User Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Intuitive and easy-to-use design for the best user experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>SEO Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Boost your search rankings with built-in SEO optimization.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t py-6 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            © 2025 MyBrand. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
