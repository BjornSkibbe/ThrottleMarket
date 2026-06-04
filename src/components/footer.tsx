import Link from "next/link"
import { Bike, Mail, LayoutDashboard, Store, MessageSquare, Plus, Motorbike } from "lucide-react"
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { CATEGORY } from "@/lib/constants"
import { formatCategory } from "@/lib/formatters";

const brand = {
  name: "ThrottleMarket",
  description: "The premium marketplace for motorcycles and riding gear. Buy and sell with confidence.",
}

const contact = {
  email: "support@throttlemarket.com",
}

const quickLinks = [
  { label: "Dashboard", href: "/marketplace-dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Messages", href: "/messaging", icon: MessageSquare },
  { label: "Create Listing", href: "/listings/create", icon: Plus },
]

const categories = Object.values(CATEGORY).map(category => ({
  label: formatCategory(category),
  value: category,
}))

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaSquareXTwitter, href: "#", label: "X" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
]

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-muted/30">
      {/* Logo + Description */}
      <div className="flex flex-col items-center space-y-4 py-12 px-3">
        <Link href="/" className="flex flex-col items-center">
          <Motorbike className="h-8 w-8 text-accent flex-shrink-0" />
          <span className="text-xl font-extrabold tracking-tighter italic">
            {brand.name}
          </span>
        </Link>

        {/* <p className="text-sm text-center text-primary/50">
          {brand.description}
        </p> */}

        <div className="flex space-x-4 pt-2 items-center">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/50 hover:text-primary transition-colors duration-300"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
        {/* Copyright */}
        <div className="text-center text-xs text-primary/50">
          <p>&copy; {year} ThrottleMarket. All rights reserved.</p>
        </div>
      </div>
      <div className="flex justify-center text-center border-t items-center py-3">
        {/* Quick Links */}
        <div className="p-3 flex justify-between">
          <ul className="flex gap-6">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="w-full flex flex-col items-center gap-2 text-xs text-primary/50 hover:text-primary transition-colors duration-300"
                >
                  <Icon className="h-4 w-4" />
                  <span className="">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      
 
    </footer>
  )
}
