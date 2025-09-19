import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaVideo, FaMicrophone, FaFileAlt, FaCalendarAlt, FaMobile, FaDesktop, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { SiGooglemeet, SiZoom, SiSlack, SiDiscord } from "react-icons/si";
import { BsMicrosoftTeams } from "react-icons/bs";
import { ChevronRight, Shield, Zap, Users } from "lucide-react";

const HomePage = () => {
  const integrations = [
    { name: "Google Meet", icon: <SiGooglemeet className="w-6 h-6 text-green-600" /> },
    { name: "Microsoft Teams", icon: <BsMicrosoftTeams className="w-6 h-6 text-blue-600" /> },
    { name: "Zoom", icon: <SiZoom className="w-6 h-6 text-blue-500" /> },
    { name: "Slack", icon: <SiSlack className="w-6 h-6 text-purple-600" /> },
    { name: "Discord", icon: <SiDiscord className="w-6 h-6 text-indigo-600" /> },
    { name: "Calendar", icon: <FaCalendarAlt className="w-6 h-6 text-red-600" /> },
    { name: "Mobile", icon: <FaMobile className="w-6 h-6 text-gray-700" /> },
    { name: "Desktop", icon: <FaDesktop className="w-6 h-6 text-gray-700" /> },
  ];

  const features = [
    {
      title: "Meeting Bot API",
      description: "Recording virtual meetings (eg. Zoom, Google Meet)",
      icon: <FaVideo className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600",
      benefits: [
        "Recording virtual meetings",
        "Explicit recording consent notification",
        "Building interactive meeting agents",
      ],
    },
    {
      title: "Desktop Recording SDK",
      description: "Recording virtual or in-person meetings",
      icon: <FaMicrophone className="w-6 h-6" />,
      color: "bg-green-50 text-green-600",
      benefits: [
        "A stealthier recording experience",
        "Building into an existing desktop app",
      ],
    },
    {
      title: "Mobile Recording SDK",
      description: "Recording in-person meetings or phone calls",
      icon: <FaFileAlt className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600",
      benefits: [
        "Recording system audio on your phone",
        "Building into an existing mobile app",
      ],
    },
  ];

  const dataPoints = [
    "Participant Names and IDs",
    "Real-time Transcripts",
    "Async Transcripts",
    "100% Perfect Diarized Transcripts",
    "Real-time Audio",
    "Real-time Video",
    "MP4 Recordings",
    "Participant Emails",
    "Screenshare Data",
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-gray-900">Meet AI</span>
              <div className="hidden md:flex items-center space-x-6">
                {["Products", "Case Studies", "API Docs", "Blog"].map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    {item} {item === "Products" || item === "API Docs" ? <ChevronRight className="w-3 h-3" /> : null}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Get a Demo
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Login
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-1">
                Get Started for Free <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Get <span className="text-blue-600">Transcripts</span>, <span className="text-blue-600">Recordings</span>, and <span className="text-blue-600">Metadata</span> from Meetings
          </h1>
          <p className="text-gray-600 mb-8">Integrates seamlessly with your favorite tools:</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {integrations.map((integration, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all scale-100 hover:scale-105">
                {integration.icon}
                <span className="text-sm font-medium text-gray-700">{integration.name}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all px-8 flex items-center gap-1">
              Get Started for Free <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 flex items-center gap-1 border-gray-300 hover:border-gray-500">
              Talk to a Human <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">
            Get <span className="text-blue-600">100+ pieces of meeting data</span> through our API
          </h2>
          <div className="bg-gray-900 rounded-2xl p-8 mb-12 text-left max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Meet AI API</h3>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-900 flex items-center gap-1">
                See API Docs <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="font-mono text-sm text-gray-100">
              <span className="text-green-400">curl</span> -X POST <span className="text-yellow-300">https://api.meetai.ai/api/</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {dataPoints.map((point, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <span className="text-gray-700 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-200">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-2xl ${feature.color} mx-auto mb-4 flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900 text-sm mb-2">Ideal For</p>
                {feature.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start space-x-3 mb-1">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-600">{b}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            The API to Get <span className="text-blue-600">Transcripts</span>, <span className="text-blue-600">Recordings</span>,<br />
            and <span className="text-blue-600">Metadata</span> from Meetings
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 px-8">
              Get Started for Free <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Talk to a Human <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700">
                Use our <span className="text-blue-600 underline">meeting bot API</span>, <span className="text-blue-600 underline">desktop recording SDK</span>, and <span className="text-blue-600 underline">mobile recording SDK</span>
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700">
                The infrastructure processing billions of minutes annually for 1,000+ conversation intelligence products
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700">
                Supports the widest range of features including <span className="text-blue-600 underline">getting participant emails</span> and <span className="text-blue-600 underline">streaming media into calls</span>
              </p>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mt-12">
            {integrations.map((integration, index) => (
              <div key={index} className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border hover:shadow-md transition-shadow">
                {integration.icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
              
                <span className="text-xl font-semibold text-gray-900">Meet AI</span>
              </div>
              <p className="text-gray-600 mb-6">
                Get <span className="text-blue-600">Transcripts</span>, <span className="text-blue-600">Recordings</span>, and <span className="text-blue-600">Metadata</span> from Meetings
              </p>
              <Button className="bg-gray-900 text-white hover:bg-gray-800">
                Get Started For Free <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {/* Footer Links */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Meeting Bot API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Desktop SDK</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Mobile SDK</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">API Docs</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-gray-600">© 2024 Recall</span>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Use</a>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" aria-label="LinkedIn" title="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" aria-label="Twitter" title="Twitter">
                <FaTwitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" aria-label="YouTube" title="YouTube">
                <FaYoutube className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
