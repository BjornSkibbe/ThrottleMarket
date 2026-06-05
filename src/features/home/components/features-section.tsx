import { Shield, TrendingUp, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Safe and secure buying and selling with verified sellers and buyer protection",
  },
  {
    icon: TrendingUp,
    title: "Wide Selection",
    description:
      "Thousands of motorcycles and riding gear listings from sellers countrywide",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join a community of passionate riders and enthusiasts",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-6 bg-muted/30">
      <div className="mx-auto px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center space-y-3 p-6 lg:p-12 rounded-4xl bg-background"
            >
              <div className="p-3 rounded-full bg-muted">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
              <p className="text-primary/50 text-sm tracking-wide">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
